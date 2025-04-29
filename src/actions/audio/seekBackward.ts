import { Playback } from "#src/features/Playback"
import { action } from "@monstermann/signals"
import { seekTo } from "./seekTo"

export const seekBackward = action((amount: number = 5) => {
    seekTo(Math.max(Playback.$position() - amount, 0))
})
