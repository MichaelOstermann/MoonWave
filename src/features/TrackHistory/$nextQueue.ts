import { Playback } from "#features/Playback"
import { Array, pipe, Set } from "@monstermann/fn"
import { effect, signal } from "@monstermann/signals"
import { TrackHistory } from "."
import { Library } from "../Library"
import { Tracks } from "../Tracks"

export const $nextQueue = signal<string[]>([])
const $playedTrackIds = signal<ReadonlySet<string>>(Set.create())

effect(() => {
    const tid = Playback.$trackId()
    if (!tid) return
    $playedTrackIds(tids => Set.add(tids, tid))
})

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
        const tids = pipe(
            Playback.$trackIds(),
            Array.removeAll($playedTrackIds()),
            Array.shuffle(),
        )
        return $nextQueue(tids)
    }
})

effect(() => {
    if (Playback.$mode() !== "SHUFFLE") return
    if ($nextQueue().length > 0) return
    if (Playback.$trackIds().length === 0) return
    if ($playedTrackIds().size === 0) return
    $playedTrackIds(Set.create<string>())
})

effect(() => {
    const [nextTrackId] = $nextQueue()
    if (!nextTrackId) return
    const nextTrack = Tracks.$byId.get(nextTrackId)
    if (!nextTrack) return
    Library.loadWaveform(nextTrack)
})
