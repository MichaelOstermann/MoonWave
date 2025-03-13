import type { Playlist } from '@app/types'
import { onDeletePlaylists, onDeleteTracks } from '@app/events'
import { map } from '@app/utils/data/map'
import { merge } from '@app/utils/data/merge'
import { without } from '@app/utils/data/without'
import { changeEffect, onEvent, signal } from '@monstermann/signals'

export const $playlists = signal<Playlist[]>([])

changeEffect($playlists, (playlistsAfter, playlistsBefore) => {
    const playlistIdsBefore = new Set(playlistsBefore.map(t => t.id))
    const playlistIdsAfter = new Set(playlistsAfter.map(t => t.id))
    const removedPlaylistIds = playlistIdsBefore.difference(playlistIdsAfter)
    if (removedPlaylistIds.size === 0) return
    onDeletePlaylists(removedPlaylistIds)
})

onEvent(onDeleteTracks, (tids) => {
    const trackIds = Array.from(tids)
    $playlists.map(map(p => merge(p, {
        trackIds: without(p.trackIds, trackIds),
    })))
})
