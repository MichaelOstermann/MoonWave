import type { Track } from "#features/Tracks"
import { LSM } from "#features/LSM"
import { Tracks } from "#features/Tracks"
import { Array, pipe } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { TrackList } from "."

export const $selected = memo<Track[]>(() => {
    return pipe(
        TrackList.$LSM(),
        LSM.getSelections,
        Array.mapEach(tid => Tracks.$byId.get(tid)),
        Array.compact(),
    )
}, { equals: Array.isShallowEqual })
