import { Playback } from "#features/Playback"
import { TrackHistory } from "#features/TrackHistory"
import { Array, flow } from "@monstermann/fn"
import { watch } from "@monstermann/signals"

watch(Playback.$trackId, (nextTrackId, prevTrackId) => {
    if (!nextTrackId || !prevTrackId) return
    if (nextTrackId === prevTrackId) return

    if (nextTrackId === TrackHistory.$nextIds().at(0)) {
        TrackHistory.$prevIds(flow(
            Array.removeAll([prevTrackId]),
            Array.append(prevTrackId),
            Array.takeLast(100),
        ))

        TrackHistory.$nextIds(Array.drop(1))
        return
    }

    if (nextTrackId === TrackHistory.$prevIds().at(-1)) {
        TrackHistory.$prevIds(Array.dropLast(1))
        TrackHistory.$nextIds(Array.prepend(prevTrackId))
        return
    }

    TrackHistory.$prevIds(flow(
        Array.removeAll([prevTrackId]),
        Array.append(prevTrackId),
        Array.takeLast(100),
    ))

    TrackHistory.$nextIds(Array.empty)
})
