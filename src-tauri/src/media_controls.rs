use crate::audio::{pause_audio, resume_audio, seek_audio, stop_audio, AudioPlayerState};
use souvlaki::{MediaControlEvent, MediaControls, PlatformConfig};
use tauri::{AppHandle, Emitter, Manager};

pub fn initialize_media_controls(
    audio_player: AudioPlayerState,
    app: AppHandle,
    config: PlatformConfig,
) {
    let player_clone = audio_player.clone();
    let player_for_events = audio_player.clone();
    let app_clone = app.clone();

    match MediaControls::new(config) {
        Ok(mut controls) => {
            // Set up event handler for media control events
            let _ = controls.attach(move |event: MediaControlEvent| match event {
                MediaControlEvent::Play => {
                    let player_state = app_clone.state::<AudioPlayerState>();
                    resume_audio(player_state, app_clone.clone());
                }
                MediaControlEvent::Pause => {
                    let player_state = app_clone.state::<AudioPlayerState>();
                    pause_audio(player_state, app_clone.clone());
                }
                MediaControlEvent::Toggle => {
                    let player_lock = player_for_events.lock().unwrap();
                    if let Some(sink) = &player_lock.sink {
                        let is_paused = sink.is_paused();
                        drop(player_lock);

                        let player_state = app_clone.state::<AudioPlayerState>();
                        if is_paused {
                            resume_audio(player_state, app_clone.clone());
                        } else {
                            pause_audio(player_state, app_clone.clone());
                        }
                    }
                }
                MediaControlEvent::Next => {
                    let _ = app_clone.emit("mpris-event", "next");
                }
                MediaControlEvent::Previous => {
                    let _ = app_clone.emit("mpris-event", "previous");
                }
                MediaControlEvent::Stop => {
                    let player_state = app_clone.state::<AudioPlayerState>();
                    stop_audio(player_state, app_clone.clone());
                }
                MediaControlEvent::Seek(dir) => {
                    let player_lock = player_for_events.lock().unwrap();
                    if let Some(sink) = &player_lock.sink {
                        let current_pos = sink.get_pos().as_secs_f64();
                        drop(player_lock);

                        let new_pos = match dir {
                            souvlaki::SeekDirection::Forward => current_pos + 5.0,
                            souvlaki::SeekDirection::Backward => (current_pos - 5.0).max(0.0),
                        };

                        let player_state = app_clone.state::<AudioPlayerState>();
                        let _ = seek_audio(new_pos, player_state, app_clone.clone());
                    }
                }
                MediaControlEvent::SeekBy(dir, dur) => {
                    let player_lock = player_for_events.lock().unwrap();
                    if let Some(sink) = &player_lock.sink {
                        let current_pos = sink.get_pos().as_secs_f64();
                        drop(player_lock);

                        let new_pos = match dir {
                            souvlaki::SeekDirection::Forward => current_pos + dur.as_secs_f64(),
                            souvlaki::SeekDirection::Backward => {
                                (current_pos - dur.as_secs_f64()).max(0.0)
                            }
                        };

                        let player_state = app_clone.state::<AudioPlayerState>();
                        let _ = seek_audio(new_pos, player_state, app_clone.clone());
                    }
                }
                _ => {}
            });

            // Store media controls in player state
            let mut player = player_clone.lock().unwrap();
            player.media_controls = Some(controls);
        }
        Err(e) => {
            eprintln!("Failed to initialize media controls: {}", e);
        }
    }
}
