import { $editingPlaylistId } from '@app/state/playlists/editingPlaylistId'
import { $playlists } from '@app/state/playlists/playlists'
import { $playlistsById } from '@app/state/playlists/playlistsById'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'
import { deletePlaylist } from './deletePlaylist'

export const savePlaylistTitle = action((title: string) => {
    const playlistId = $editingPlaylistId()
    if (!playlistId) return

    $editingPlaylistId.set(null)

    const prevTitle = $playlistsById(playlistId)()?.title || ''
    const nextTitle = title || prevTitle

    if (prevTitle === '' && nextTitle === '') {
        deletePlaylist(playlistId)
    }
    else {
        $playlists.map(findAndMap(
            p => p.id === playlistId,
            p => merge(p, { title: nextTitle }),
        ))
    }
})
