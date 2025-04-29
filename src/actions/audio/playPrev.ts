import { TrackHistory } from "#features/TrackHistory"
import { Array } from "@monstermann/fn"
import { action } from "@monstermann/signals"
import { playTrack } from "./playTrack"
import { stopPlayback } from "./stopPlayback"

export const playPrev = action(async () => {
    const queue = TrackHistory.$prevQueue()
    let i = queue.length

    while (i--) {
        const trackId = Array.atOrThrow(queue, i)
        if (await playTrack({ trackId })) return
    }

    stopPlayback()
})
