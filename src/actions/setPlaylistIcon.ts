import type { PlaylistIcon } from '@app/types'
import { $playlists } from '@app/state/state'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { action } from '@app/utils/signals/action'

export const setPlaylistIcon = action(({ playlistId, icon }: { playlistId: string, icon: PlaylistIcon }) => {
    $playlists.map(findAndMap(
        p => p.id === playlistId,
        p => p.icon?.type === icon.type && p.icon.value === icon.value
            ? merge(p, { icon: undefined })
            : merge(p, { icon }),
    ))
})
