use tauri::Manager;
use tauri_plugin_window_state::StateFlags;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};
use lofty::file::{AudioFile, TaggedFileExt};
use lofty::tag::Accessor;
use serde::Serialize;
use new_mime_guess::from_path;

#[derive(Serialize)]
pub struct AudioMetadata {
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    duration: u32,
    year: Option<u32>,
    track_number: Option<u32>,
    disk_number: Option<u32>,
}

#[tauri::command]
fn parse_audio_metadata(file_path: String) -> Option<AudioMetadata> {
    match lofty::read_from_path(&file_path) {
        Ok(tagged_file) => {
            let tag = tagged_file.primary_tag()?;
            let props = tagged_file.properties();

            Some(AudioMetadata {
                title: tag.title().map(|t| t.into_owned()),
                artist: tag.artist().map(|t| t.into_owned()),
                album: tag.album().map(|t| t.into_owned()),
                duration: u32::try_from(props.duration().as_secs()).unwrap_or(0),
                year: tag.year(),
                track_number: tag.track(),
                disk_number: tag.disk(),
            })
        },
        Err(_) => None,
    }
}

#[tauri::command]
fn get_file_mimetype(file_path: String) -> String {
    let mime = from_path(file_path).first_or_octet_stream();
    mime.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
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
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, Some(NSVisualEffectState::Active), Some(10.0))
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![parse_audio_metadata, get_file_mimetype])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
