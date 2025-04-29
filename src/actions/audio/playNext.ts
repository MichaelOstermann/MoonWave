import { TrackHistory } from "#features/TrackHistory"
import { Array } from "@monstermann/fn"
import { action } from "@monstermann/signals"
import { playTrack } from "./playTrack"
import { stopPlayback } from "./stopPlayback"

export const playNext = action(async () => {
    const queue = TrackHistory.$nextQueue()

    for (let i = 0; i < queue.length; i++) {
        const trackId = Array.atOrThrow(queue, i)
        if (await playTrack({ trackId })) return
    }

    stopPlayback()
})
