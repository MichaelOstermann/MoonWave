import { Playback } from "#features/Playback"
import { Array } from "@monstermann/fn"
import { effect, signal, untrack } from "@monstermann/signals"
import { TrackHistory } from "."
import { Library } from "../Library"
import { Tracks } from "../Tracks"

export const $nextQueue = signal<string[]>([])

effect(() => {
    const mode = Playback.$mode()

    if (mode === "SINGLE") {
        const trackId = Playback.$trackId() ?? Playback.$trackIds().at(0)
        return $nextQueue(trackId ? [trackId] : [])
    }

    if (!Array.isEmpty(TrackHistory.$nextIds())) {
        return $nextQueue(TrackHistory.$nextIds())
    }

    if (mode === "REPEAT") {
        const trackId = Playback.$trackId()
        const trackIds = Playback.$trackIds()
        const offset = trackId ? Array.indexOf(trackIds, trackId) + 1 : 0
        const nextTrackIds = Array.drop(trackIds, offset)
        return $nextQueue(Array.isEmpty(nextTrackIds) ? trackIds : nextTrackIds)
    }

    if (mode === "SHUFFLE") {
        return $nextQueue(Array.shuffle(Playback.$trackIds()))
    }
})

effect(() => {
    const trackId = Playback.$trackId()
    if (!trackId) return
    untrack(() => {
        if (Playback.$mode() !== "SHUFFLE") return
        if (!Array.isEmpty(TrackHistory.$nextIds())) return
        const queue = Array.remove($nextQueue(), trackId)
        const nextQueue = queue.length
            ? queue
            : Array.remove(Array.shuffle(Playback.$trackIds()), trackId)
        $nextQueue(nextQueue)
    })
})

effect(() => {
    const [nextTrackId] = $nextQueue()
    if (!nextTrackId) return
    const nextTrack = Tracks.$byId.get(nextTrackId)
    if (!nextTrack) return
    Library.loadWaveform(nextTrack)
})
