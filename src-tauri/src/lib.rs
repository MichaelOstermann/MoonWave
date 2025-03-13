use lofty::config::WriteOptions;
use lofty::file::{AudioFile, TaggedFileExt};
use lofty::tag::{Accessor, Tag};
use new_mime_guess::from_path;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use ring::digest::{Context, SHA256};
use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::{BufReader, Read};
use std::os::unix::fs::MetadataExt;
use std::path::Path;
use tauri::Manager;
use tauri_plugin_window_state::StateFlags;
use trash;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

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
    #[serde(skip_serializing_if = "Option::is_none")]
    year: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    track_nr: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    disk_nr: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    sample_rate: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    bitrate: Option<u32>,
}

#[derive(Deserialize)]
struct TagUpdate {
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    year: Option<u32>,
    #[serde(rename = "trackNr")]
    track_nr: Option<u32>,
    #[serde(rename = "diskNr")]
    disk_nr: Option<u32>,
}

#[tauri::command(async)]
fn parse_audio_metadata(file_paths: Vec<String>) -> Vec<AudioMetadata> {
    file_paths
        .par_iter()
        .map(|file_path| -> Option<AudioMetadata> {
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
                        path: file_path.to_owned(),
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
        })
        .flatten()
        .collect::<Vec<AudioMetadata>>()
}

fn hash_file(file_path: &str) -> Option<String> {
    let file = File::open(file_path).ok()?;
    let mut reader = BufReader::new(file);
    let mut context = Context::new(&SHA256);

    let mut buffer = [0; 4096];
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
        .collect::<String>();

    Some(hex_digest)
}

#[tauri::command(async)]
fn save_tags(path: String, tags: TagUpdate) -> Option<AudioMetadata> {
    let mut tagged_file = match lofty::read_from_path(&path) {
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
        Some(year) => tag.set_year(year),
        None => tag.remove_year(),
    };

    match tags.track_nr {
        Some(track_nr) => tag.set_track(track_nr),
        None => tag.remove_track(),
    };

    match tags.disk_nr {
        Some(disk_nr) => tag.set_disk(disk_nr),
        None => tag.remove_disk(),
    };

    tagged_file
        .save_to_path(&path, WriteOptions::default())
        .ok()?;

    parse_audio_metadata(vec![path]).into_iter().nth(0)
}

#[tauri::command(async)]
fn trash_files(file_paths: Vec<String>) -> bool {
    trash::delete_all(file_paths).is_ok()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(
                &window,
                NSVisualEffectMaterial::HudWindow,
                Some(NSVisualEffectState::Active),
                Some(10.0),
            )
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            parse_audio_metadata,
            trash_files,
            save_tags
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
