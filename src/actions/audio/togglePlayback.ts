import { Playback } from "#features/Playback"
import { action } from "@monstermann/signals"
import { pausePlayback } from "./pausePlayback"
import { resumePlayback } from "./resumePlayback"

export const togglePlayback = action(() => {
    Playback.$isPlaying()
        ? pausePlayback()
        : resumePlayback()
})
