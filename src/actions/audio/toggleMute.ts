import { Playback } from "#features/Playback"
import { action } from "@monstermann/signals"
import { mute } from "./mute"
import { unmute } from "./unmute"

export const toggleMute = action(() => {
    Playback.$volume() === 0
        ? unmute()
        : mute()
})
