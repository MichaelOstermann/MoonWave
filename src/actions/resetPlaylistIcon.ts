import { $playlists } from '@app/state/playlists'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { action } from '@app/utils/signals/action'

export const resetPlaylistIcon = action((playlistId: string) => {
    $playlists.map(findAndMap(
        p => p.id === playlistId,
        p => merge(p, { icon: undefined, color: undefined }),
    ))
})
