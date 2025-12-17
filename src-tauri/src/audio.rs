use lofty::file::{AudioFile, TaggedFileExt};
use lofty::tag::Accessor;
use rodio::Decoder;
use serde::Serialize;
use souvlaki::{MediaControls, MediaMetadata, MediaPlayback, MediaPosition};
use std::fs::File;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::async_runtime::JoinHandle;
use tauri::Emitter;

use crate::to_nfc;

pub struct AudioPlayer {
    pub sink: Option<rodio::Sink>,
    pub _stream: Option<rodio::OutputStream>,
    pub duration: Option<f64>,
    pub current_file: Option<String>,
    pub monitor_task: Option<JoinHandle<()>>,
    pub media_controls: Option<MediaControls>,
}

// SAFETY: AudioPlayer is wrapped in Arc<Mutex<_>> which provides synchronization.
// The Send/Sync requirements are needed for Tauri's state management.
// While rodio::OutputStream contains platform-specific types that may not be Send
// on macOS (due to cpal 0.16.0's CoreAudio backend), the Mutex wrapper ensures
// thread-safe access. This is a known limitation of cpal 0.16.0 on macOS.
unsafe impl Send for AudioPlayer {}
unsafe impl Sync for AudioPlayer {}

pub type AudioPlayerState = Arc<Mutex<AudioPlayer>>;

#[derive(Clone, Serialize)]
struct PlaybackEvent {
    event_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    file_path: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    duration: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    volume: Option<f32>,
}

#[tauri::command]
pub async fn play_audio(
    file_path: String,
    player: tauri::State<'_, AudioPlayerState>,
    app: tauri::AppHandle,
) -> Result<(), String> {
    let player = player.inner().clone();
    let app_clone = app.clone();

    tauri::async_runtime::spawn_blocking(move || {
        // Normalize path to NFC (JavaScript may have decomposed it to NFD)
        let nfc_path = to_nfc(&file_path);

        // Stop any existing playback and monitoring
        {
            let mut player_lock = player.lock().unwrap();
            if let Some(sink) = player_lock.sink.take() {
                sink.stop();
            }
            if let Some(task) = player_lock.monitor_task.take() {
                task.abort();
            }
            player_lock._stream = None;
        }

        // Get output stream
        let stream_handle = rodio::OutputStreamBuilder::open_default_stream()
            .map_err(|e| format!("Failed to open audio stream: {}", e))?;

        // Create a sink for playback control
        let sink = rodio::Sink::connect_new(&stream_handle.mixer());

        // Get duration from metadata if available
        let duration = lofty::read_from_path(&nfc_path)
            .ok()
            .and_then(|tagged_file| Some(tagged_file.properties().duration().as_secs_f64()));

        // Open and decode the audio file
        let file = File::open(&nfc_path)
            .map_err(|e| format!("Failed to open file {}: {}", file_path, e))?;

        let source =
            Decoder::try_from(file).map_err(|e| format!("Failed to decode audio: {}", e))?;

        // Add source to sink
        sink.append(source);

        // Spawn a task to monitor playback completion and emit position updates
        let player_clone = player.clone();
        let app_monitor = app_clone.clone();
        let monitor_task = tauri::async_runtime::spawn_blocking(move || {
            loop {
                std::thread::sleep(Duration::from_millis(100));

                let mut player_lock = player_clone.lock().unwrap();

                if let Some(sink) = &player_lock.sink {
                    // Check if playback has finished (sink is empty and not paused)
                    if sink.empty() && !sink.is_paused() {
                        // Get file info before clearing state
                        let file_path = player_lock.current_file.clone();
                        let duration = player_lock.duration;
                        let current_volume = sink.volume();

                        // Drop lock before emitting and cleanup
                        drop(player_lock);

                        // Emit finished event
                        let _ = app_monitor.emit(
                            "playback",
                            PlaybackEvent {
                                event_type: "finished".to_string(),
                                file_path,
                                duration,
                                position: duration,
                                volume: Some(current_volume),
                            },
                        );

                        // Clean up player state
                        let mut player_lock = player_clone.lock().unwrap();
                        player_lock.sink = None;
                        player_lock._stream = None;
                        player_lock.current_file = None;
                        player_lock.monitor_task = None;

                        break;
                    } else if !sink.is_paused() {
                        // Emit position update while playing
                        let position = sink.get_pos().as_secs_f64();
                        let file_path = player_lock.current_file.clone();
                        let duration = player_lock.duration;
                        let current_volume = sink.volume();

                        // Update MPRIS progress
                        if let Some(controls) = &mut player_lock.media_controls {
                            let progress = MediaPosition(Duration::from_secs_f64(position));
                            let _ = controls.set_playback(MediaPlayback::Playing {
                                progress: Some(progress),
                            });
                        }

                        // Drop lock before emitting
                        drop(player_lock);

                        let _ = app_monitor.emit(
                            "playback",
                            PlaybackEvent {
                                event_type: "position".to_string(),
                                file_path,
                                duration,
                                position: Some(position),
                                volume: Some(current_volume),
                            },
                        );
                    }
                } else {
                    // No sink, exit monitoring
                    break;
                }
            }
        });

        // Update player state and MPRIS metadata
        let current_volume = {
            let mut player_lock = player.lock().unwrap();
            player_lock.sink = Some(sink);
            player_lock._stream = Some(stream_handle);
            player_lock.duration = duration;
            player_lock.current_file = Some(file_path.clone());
            player_lock.monitor_task = Some(monitor_task);

            let volume = player_lock.sink.as_ref().map(|s| s.volume()).unwrap_or(1.0);

            // Update MPRIS metadata and status
            if let Some(controls) = &mut player_lock.media_controls {
                // Try to get metadata from the file
                if let Ok(tagged_file) = lofty::read_from_path(&nfc_path) {
                    if let Some(tag) = tagged_file.primary_tag() {
                        let title = tag.title().unwrap_or_default().to_string();
                        let artist = tag.artist().unwrap_or_default().to_string();
                        let album = tag.album().unwrap_or_default().to_string();

                        let metadata = MediaMetadata {
                            title: if !title.is_empty() {
                                Some(&title)
                            } else {
                                None
                            },
                            artist: if !artist.is_empty() {
                                Some(&artist)
                            } else {
                                None
                            },
                            album: if !album.is_empty() {
                                Some(&album)
                            } else {
                                None
                            },
                            duration: duration.map(|d| Duration::from_secs_f64(d)),
                            ..Default::default()
                        };

                        let _ = controls.set_metadata(metadata);
                    }
                }

                let progress = Some(MediaPosition(Duration::from_secs(0)));
                let _ = controls.set_playback(MediaPlayback::Playing { progress });
            }

            volume
        };

        // Emit playback started event
        let _ = app.emit(
            "playback",
            PlaybackEvent {
                event_type: "started".to_string(),
                file_path: Some(file_path),
                duration,
                position: None,
                volume: Some(current_volume),
            },
        );

        Ok(())
    })
    .await
    .map_err(|e| format!("Task join error: {}", e))?
}

#[tauri::command]
pub fn seek_audio(
    position: f64,
    player: tauri::State<'_, AudioPlayerState>,
    app: tauri::AppHandle,
) -> Result<(), String> {
    let player_lock = player.lock().unwrap();

    // If there's no sink or file, just ignore
    if player_lock.sink.is_none() {
        return Ok(());
    }

    let sink = player_lock.sink.as_ref().unwrap();
    let seek_duration = Duration::from_secs_f64(position.max(0.0));
    let volume = sink.volume();

    // Try to seek using Rodio's built-in seek
    sink.try_seek(seek_duration)
        .map_err(|e| format!("Failed to seek: {}", e))?;

    let file_path = player_lock.current_file.clone();
    let duration = player_lock.duration;

    // Drop lock before emitting
    drop(player_lock);

    // Emit seeked event
    let _ = app.emit(
        "playback",
        PlaybackEvent {
            event_type: "seeked".to_string(),
            file_path,
            duration,
            position: Some(position),
            volume: Some(volume),
        },
    );

    Ok(())
}

#[tauri::command]
pub fn pause_audio(player: tauri::State<'_, AudioPlayerState>, app: tauri::AppHandle) {
    let mut player_lock = player.lock().unwrap();
    if let Some(sink) = &player_lock.sink {
        sink.pause();

        let volume = sink.volume();
        let position = Some(sink.get_pos().as_secs_f64());
        let file_path = player_lock.current_file.clone();
        let duration = player_lock.duration;

        // Update MPRIS status
        if let Some(controls) = &mut player_lock.media_controls {
            let progress = position.map(|pos| MediaPosition(Duration::from_secs_f64(pos)));
            let _ = controls.set_playback(MediaPlayback::Paused { progress });
        }

        // Emit paused event
        let _ = app.emit(
            "playback",
            PlaybackEvent {
                event_type: "paused".to_string(),
                file_path,
                duration,
                position,
                volume: Some(volume),
            },
        );
    }
}

#[tauri::command]
pub fn resume_audio(player: tauri::State<'_, AudioPlayerState>, app: tauri::AppHandle) {
    let mut player_lock = player.lock().unwrap();
    if let Some(sink) = &player_lock.sink {
        sink.play();

        let volume = sink.volume();
        let position = Some(sink.get_pos().as_secs_f64());
        let file_path = player_lock.current_file.clone();
        let duration = player_lock.duration;

        // Update MPRIS status
        if let Some(controls) = &mut player_lock.media_controls {
            let progress = position.map(|pos| MediaPosition(Duration::from_secs_f64(pos)));
            let _ = controls.set_playback(MediaPlayback::Playing { progress });
        }

        // Emit resumed event
        let _ = app.emit(
            "playback",
            PlaybackEvent {
                event_type: "resumed".to_string(),
                file_path,
                duration,
                position,
                volume: Some(volume),
            },
        );
    }
}

#[tauri::command]
pub fn stop_audio(player: tauri::State<'_, AudioPlayerState>, app: tauri::AppHandle) {
    let mut player_lock = player.lock().unwrap();
    if let Some(sink) = player_lock.sink.take() {
        sink.stop();
    }

    // Abort the monitoring task
    if let Some(task) = player_lock.monitor_task.take() {
        task.abort();
    }

    let volume = match player_lock.sink.take() {
        Some(sink) => Some(sink.volume()),
        None => None,
    };

    let file_path = player_lock.current_file.clone();
    let duration = player_lock.duration;

    player_lock._stream = None;
    player_lock.current_file = None;

    // Update MPRIS status
    if let Some(controls) = &mut player_lock.media_controls {
        let _ = controls.set_playback(MediaPlayback::Stopped);
    }

    // Emit stopped event
    let _ = app.emit(
        "playback",
        PlaybackEvent {
            event_type: "stopped".to_string(),
            file_path,
            duration,
            position: None,
            volume: volume,
        },
    );
}

#[tauri::command]
pub fn set_volume(volume: f32, player: tauri::State<'_, AudioPlayerState>, app: tauri::AppHandle) {
    let player_lock = player.lock().unwrap();
    if let Some(sink) = &player_lock.sink {
        sink.set_volume(volume);
    }

    let file_path = player_lock.current_file.clone();
    let duration = player_lock.duration;

    let _ = app.emit(
        "playback",
        PlaybackEvent {
            event_type: "volume".to_string(),
            file_path,
            duration,
            position: None,
            volume: Some(volume),
        },
    );
}
