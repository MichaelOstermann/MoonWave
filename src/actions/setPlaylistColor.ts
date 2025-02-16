import type { PlaylistColor } from '@app/types'
import { $playlists } from '@app/state/state'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { action } from '@app/utils/signals/action'

export const setPlaylistColor = action(({ playlistId, color }: { playlistId: string, color: PlaylistColor | undefined }) => {
    $playlists.map(findAndMap(
        p => p.id === playlistId,
        p => merge(p, { color }),
    ))
})
