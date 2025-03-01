import type { Playlist } from '@app/types'
import { onDeletePlaylists, onDeleteTracks } from '@app/events'
import { map } from '@app/utils/data/map'
import { removePlaylistTracks } from '@app/utils/playlist/removePlaylistTracks'
import { changeEffect } from '@app/utils/signals/changeEffect'
import { onEvent } from '@app/utils/signals/onEvent'
import { signal } from '@app/utils/signals/signal'

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
    $playlists.map(map(p => removePlaylistTracks(p, trackIds)))
})
