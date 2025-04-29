mod audio;
mod media_controls;
mod waveform;
use lofty::config::WriteOptions;
use lofty::file::{AudioFile, TaggedFileExt};
use lofty::tag::{Accessor, Tag};
use new_mime_guess::from_path;
use ring::digest::{Context, SHA256};
use serde::{Deserialize, Serialize};
use souvlaki::PlatformConfig;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::fs::File;
use std::io::{BufReader, Read};
use std::os::unix::fs::MetadataExt;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use tauri::Manager;
use tauri_plugin_window_state::StateFlags;
use trash;
use unicode_normalization::UnicodeNormalization;

// Normalize paths to NFC (composed form)
// Files are stored as NFC on disk, but JavaScript may decompose them to NFD
pub(crate) fn to_nfc(path: &str) -> String {
    path.nfc().collect()
}

#[derive(Serialize)]
struct AudioMetadata {
    path: String,
    filehash: String,
    title: String,
    artist: String,
    album: String,
    size: u64,
    mimetype: String,
    duration: u32,
    year: Option<u32>,
    #[serde(rename = "trackNr")]
    track_nr: Option<u32>,
    #[serde(rename = "diskNr")]
    disk_nr: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none", rename = "sampleRate")]
    sample_rate: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    bitrate: Option<u32>,
}

#[derive(Deserialize)]
struct TagUpdate {
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    year: Option<String>,
    #[serde(rename = "trackNr")]
    track_nr: Option<String>,
    #[serde(rename = "diskNr")]
    disk_nr: Option<String>,
}

#[tauri::command]
async fn parse_audio_metadata(paths: Vec<String>) -> Vec<AudioMetadata> {
    let mut handles = Vec::with_capacity(paths.len());

    for path in paths {
        handles.push(tauri::async_runtime::spawn_blocking(move || {
            let nfc_path = to_nfc(&path);
            parse_file(&nfc_path)
        }));
    }

    let mut results = Vec::new();

    for handle in handles {
        if let Ok(Some(data)) = handle.await {
            results.push(data)
        }
    }

    results
}

#[tauri::command(async)]
fn scan(paths: Vec<String>) -> Vec<PathBuf> {
    let mut files = Vec::new();

    for path in paths {
        let pathbuf = PathBuf::from(&path);
        match fs::metadata(&pathbuf) {
            Ok(metadata) => {
                if metadata.is_file() {
                    let nfc_path = to_nfc(&path);
                    files.push(PathBuf::from(nfc_path));
                } else if metadata.is_dir() {
                    scan_dir(path, &mut files);
                };
            }
            Err(_) => {}
        }
    }

    files
}

fn scan_dir(path: String, files: &mut Vec<PathBuf>) -> () {
    let mut stack = Vec::new();
    stack.push(PathBuf::from(path));

    while let Some(next) = stack.pop() {
        if let Ok(direntries) = fs::read_dir(&next) {
            for direntry in direntries {
                if let Ok(entry) = direntry {
                    let path = entry.path();
                    if let Ok(metadata) = fs::metadata(&path) {
                        if metadata.is_dir() {
                            stack.push(path.clone());
                        } else if metadata.is_file() {
                            if let Some(path_str) = path.to_str() {
                                let nfc_path = to_nfc(path_str);
                                files.push(PathBuf::from(nfc_path));
                            }
                        };
                    };
                };
            }
        };
    }
}

fn hash_file(file_path: &str) -> Option<String> {
    let file = File::open(file_path).ok()?;
    let mut reader = BufReader::new(file);
    let mut context = Context::new(&SHA256);

    let mut buffer = [0; 256 * 1024];
    while let Ok(n) = reader.read(&mut buffer) {
        if n == 0 {
            break;
        }
        context.update(&buffer[..n]);
    }

    let digest = context.finish();

    let hex_digest = digest
        .as_ref()
        .iter()
        .map(|b| format!("{:02x}", b))
        .collect();

    Some(hex_digest)
}

fn parse_file(file_path: &str) -> Option<AudioMetadata> {
    match lofty::read_from_path(&file_path) {
        Ok(tagged_file) => {
            let tag = tagged_file.primary_tag()?;
            let props = tagged_file.properties();
            let filehash = hash_file(&file_path)?;
            let mimetype = from_path(&file_path).first_or_octet_stream();

            let metadata = fs::metadata(&file_path);
            let size = match metadata {
                Ok(metadata) => metadata.size(),
                Err(_) => 0,
            };

            let mut title = tag.title().unwrap_or_default().trim().to_owned();

            if title.is_empty() {
                title = Path::new(&file_path)
                    .with_extension("")
                    .file_name()
                    .and_then(|t| t.to_str())
                    .unwrap_or_default()
                    .to_owned()
            }

            Some(AudioMetadata {
                path: to_nfc(file_path),
                filehash: filehash,
                title: title,
                artist: tag.artist().unwrap_or_default().trim().to_owned(),
                album: tag.album().unwrap_or_default().trim().to_owned(),
                size: size,
                mimetype: mimetype.to_string(),
                duration: u32::try_from(props.duration().as_secs()).unwrap_or_default(),
                year: tag.year(),
                track_nr: tag.track(),
                disk_nr: tag.disk(),
                sample_rate: props.sample_rate(),
                bitrate: props.audio_bitrate(),
            })
        }
        Err(_) => None,
    }
}

#[tauri::command]
async fn save_tags(updates: Vec<(String, TagUpdate)>) -> Vec<AudioMetadata> {
    let mut handles = Vec::with_capacity(updates.len());

    for update in updates {
        handles.push(tauri::async_runtime::spawn_blocking(move || {
            let (path, tags) = update;
            let nfc_path = to_nfc(&path);

            let mut tagged_file = match lofty::read_from_path(&nfc_path) {
                Ok(file) => file,
                Err(_) => return None,
            };

            let tag = match tagged_file.primary_tag_mut() {
                Some(tag) => tag,
                None => {
                    let format = tagged_file.file_type();
                    let tag_type = format.primary_tag_type();
                    tagged_file.insert_tag(Tag::new(tag_type));
                    tagged_file.primary_tag_mut().unwrap()
                }
            };

            match tags.title {
                Some(title) => tag.set_title(title),
                None => tag.remove_title(),
            };

            match tags.artist {
                Some(artist) => tag.set_artist(artist),
                None => tag.remove_artist(),
            };

            match tags.album {
                Some(album) => tag.set_album(album),
                None => tag.remove_album(),
            };

            match tags.year {
                Some(year) => match year.parse() {
                    Ok(year) => tag.set_year(year),
                    Err(_) => tag.remove_year(),
                },
                None => tag.remove_year(),
            };

            match tags.track_nr {
                Some(track_nr) => match track_nr.parse() {
                    Ok(track_nr) => tag.set_track(track_nr),
                    Err(_) => tag.remove_track(),
                },
                None => tag.remove_track(),
            };

            match tags.disk_nr {
                Some(disk_nr) => match disk_nr.parse() {
                    Ok(disk_nr) => tag.set_disk(disk_nr),
                    Err(_) => tag.remove_disk(),
                },
                None => tag.remove_disk(),
            };

            tagged_file
                .save_to_path(&nfc_path, WriteOptions::default())
                .ok()?;

            parse_file(&nfc_path)
        }));
    }

    let mut results = Vec::new();

    for handle in handles {
        if let Ok(Some(data)) = handle.await {
            results.push(data)
        }
    }

    results
}

#[tauri::command(async)]
fn move_files(base_path: String, paths: Vec<[String; 2]>) -> HashMap<String, String> {
    let mut dirs = HashSet::new();
    let mut errors = HashMap::new();

    for pair in &paths {
        let nfc_dst = to_nfc(&pair[1]);
        let path = PathBuf::from(&nfc_dst);
        if let Some(parent_path) = path.parent() {
            dirs.insert(parent_path.to_path_buf());
        }
    }

    for dir in dirs {
        let _ = fs::create_dir_all(&dir);
    }

    for pair in &paths {
        let src_nfc = to_nfc(&pair[0]);
        let dst_nfc = to_nfc(&pair[1]);
        let src_path = PathBuf::from(&src_nfc);
        let dst_path = PathBuf::from(&dst_nfc);
        if src_path.starts_with(&base_path) {
            match fs::rename(src_path, dst_path) {
                Ok(_) => {}
                Err(e) => {
                    errors.insert(src_nfc.clone(), e.to_string());
                }
            }
        } else {
            match fs::copy(src_path, dst_path) {
                Ok(_) => {}
                Err(e) => {
                    errors.insert(src_nfc.clone(), e.to_string());
                }
            }
        }
    }

    errors
}

#[tauri::command(async)]
fn remove_files(paths: Vec<String>) -> HashMap<String, String> {
    let mut errors = HashMap::new();

    for path in &paths {
        let nfc_path = to_nfc(path);
        match fs::remove_file(&nfc_path) {
            Ok(_) => {}
            Err(e) => {
                errors.insert(path.clone(), e.to_string());
            }
        }
    }

    errors
}

#[tauri::command(async)]
fn trash_files(paths: Vec<String>) -> bool {
    let nfc_paths: Vec<String> = paths.iter().map(|p| to_nfc(p)).collect();
    trash::delete_all(nfc_paths).is_ok()
}

#[tauri::command]
async fn generate_waveform(file_path: String) -> Result<Vec<f64>, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let nfc_path = to_nfc(&file_path);
        waveform::generate_waveform(&nfc_path)
    })
    .await
    .map_err(|e| format!("Task join error: {}", e))?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "linux")]
            window.set_decorations(false)?;

            // Initialize audio player state
            let audio_player = Arc::new(Mutex::new(audio::AudioPlayer {
                sink: None,
                _stream: None,
                duration: None,
                current_file: None,
                monitor_task: None,
                media_controls: None,
            }));

            // Initialize media controls (MPRIS)
            #[cfg(not(target_os = "macos"))]
            let hwnd = None;

            #[cfg(target_os = "macos")]
            let hwnd = {
                use tauri::WebviewWindowExt as _;
                window.ns_window().map(|w| w as _)
            };

            let config = PlatformConfig {
                dbus_name: "moonwave",
                display_name: "MoonWave",
                hwnd,
            };

            media_controls::initialize_media_controls(
                audio_player.clone(),
                app.handle().clone(),
                config,
            );

            app.manage(audio_player);

            Ok(())
        })
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(
                    StateFlags::all() & !StateFlags::VISIBLE & !StateFlags::DECORATIONS,
                )
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            generate_waveform,
            move_files,
            parse_audio_metadata,
            audio::pause_audio,
            audio::play_audio,
            remove_files,
            audio::resume_audio,
            save_tags,
            scan,
            audio::seek_audio,
            audio::set_volume,
            audio::stop_audio,
            trash_files,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
