import { $editingPlaylistId, $playlists } from '@app/state/state'
import { findAndMap } from '@app/utils/data/findAndMap'
import { setPlaylistTitle } from '@app/utils/playlist/setPlaylistTitle'
import { action } from '@app/utils/signals/action'

export const savePlaylistTitle = action((title: string) => {
    $playlists.map(findAndMap(
        p => p.id === $editingPlaylistId.value,
        p => setPlaylistTitle(p, title),
    ))

    $editingPlaylistId.set(null)
})
