import { $playlists } from '@app/state/playlists/playlists'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { hasPlaylistChildren } from '@app/utils/playlist/hasPlaylistChildren'
import { action } from '@monstermann/signals'

export const togglePlaylist = action((playlistId: string) => {
    if (!hasPlaylistChildren(playlistId)) return

    $playlists.map(ps => findAndMap(
        ps,
        p => p.id === playlistId,
        p => merge(p, { expanded: p.expanded ? undefined : true }),
    ))
})
