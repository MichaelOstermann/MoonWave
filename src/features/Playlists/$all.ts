import type { Playlist } from "."
import { onDeletePlaylists, onDeleteTracks } from "#src/events"
import { Array, Object, Set } from "@monstermann/fn"
import { signal, watch } from "@monstermann/signals"

export const $all = signal<Playlist[]>([])

watch($all, (playlistsAfter, playlistsBefore) => {
    const playlistIdsBefore = Set.create(playlistsBefore.map(t => t.id))
    const playlistIdsAfter = Set.create(playlistsAfter.map(t => t.id))
    const removedPlaylistIds = Set.difference(playlistIdsBefore, playlistIdsAfter)
    if (removedPlaylistIds.size === 0) return
    onDeletePlaylists(removedPlaylistIds)
})

onDeleteTracks((tids) => {
    $all(Array.mapEach(p => Object.merge(p, {
        trackIds: Array.removeAll(p.trackIds, tids),
    })))
})
