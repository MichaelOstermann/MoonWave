import { Playback } from "#src/features/Playback"
import { action } from "@monstermann/signals"
import { seekTo } from "./seekTo"

export const seekForward = action((amount: number = 5) => {
    seekTo(Math.min(Playback.$position() + amount, Playback.$duration()))
})
