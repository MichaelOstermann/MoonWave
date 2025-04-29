import { Playback } from "#features/Playback"
import { action } from "@monstermann/signals"
import { invoke } from "@tauri-apps/api/core"
import { playNext } from "./playNext"

export const resumePlayback = action(() => {
    Playback.$hasTrack()
        ? invoke("resume_audio")
        : playNext()
})
