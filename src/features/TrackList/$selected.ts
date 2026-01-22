import type { Track } from "#features/Tracks"
import { Tracks } from "#features/Tracks"
import { Array, pipe } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { TrackList } from "."

export const $selected = memo<Track[]>(() => {
    return pipe(
        TrackList.$LSM().selected as string[], // TODO
        Array.mapEach(tid => Tracks.$byId.get(tid)),
        Array.compact(),
    )
}, { equals: Array.isShallowEqual })
