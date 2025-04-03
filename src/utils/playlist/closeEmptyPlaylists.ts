import type { Playlist } from '@app/types'
import { map } from '../data/map'
import { createPlaylistTree } from './createPlaylistTree'
import { hasPlaylistChildren } from './hasPlaylistChildren'

export function closeEmptyPlaylists(playlists: Playlist[]): Playlist[] {
    const tree = createPlaylistTree(playlists)
    return map(playlists, (p) => {
        if (!p.expanded) return p
        if (hasPlaylistChildren(p.id, tree)) return p
        return { ...p, expanded: undefined }
    })
}
