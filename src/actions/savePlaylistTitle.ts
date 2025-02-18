import { $editingPlaylistId, $playlists, $playlistsById } from '@app/state/state'
import { findAndMap } from '@app/utils/data/findAndMap'
import { findAndRemove } from '@app/utils/data/findAndRemove'
import { setPlaylistTitle } from '@app/utils/playlist/setPlaylistTitle'
import { action } from '@app/utils/signals/action'

export const savePlaylistTitle = action((title: string) => {
    const playlistId = $editingPlaylistId()
    if (!playlistId) return

    $editingPlaylistId.set(null)

    const prevTitle = $playlistsById(playlistId)()?.title || ''
    const nextTitle = title || prevTitle

    if (prevTitle === '' && nextTitle === '') {
        $playlists.map(findAndRemove(p => p.id === playlistId))
    }
    else {
        $playlists.map(findAndMap(
            p => p.id === playlistId,
            p => setPlaylistTitle(p, nextTitle),
        ))
    }
})
