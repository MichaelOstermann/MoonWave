import type { Track } from "#features/Tracks"
import { Tracks } from "#features/Tracks"
import { Views } from "#features/Views"
import { match } from "@monstermann/fn"
import { memo } from "@monstermann/signals"

export const $tracks = memo<Track[]>(() => {
    return match
        .shape(Views.$selected())
        .onCase({ name: "LIBRARY" }, () => Tracks.forLibrary({ applyFilter: true }))
        .onCase({ name: "UNSORTED" }, () => Tracks.forUnsorted({ applyFilter: true }))
        .onCase({ name: "RECENTLY_ADDED" }, () => Tracks.forRecentlyAdded({ applyFilter: true }))
        .onCase({ name: "PLAYLIST" }, v => Tracks.forPlaylist(v.value, { applyFilter: true }))
        .orThrow()
})
