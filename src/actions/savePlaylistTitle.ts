import { $editingPlaylistId } from '@app/state/editingPlaylistId'
import { $playlists } from '@app/state/playlists'
import { $playlistsById } from '@app/state/playlistsById'
import { findAndMap } from '@app/utils/data/findAndMap'
import { setPlaylistTitle } from '@app/utils/playlist/setPlaylistTitle'
import { action } from '@app/utils/signals/action'
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
            p => setPlaylistTitle(p, nextTitle),
        ))
    }
})
