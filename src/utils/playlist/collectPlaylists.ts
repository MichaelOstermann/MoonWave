import type { Playlist } from '@app/types'
import type { Tree } from './createPlaylistTree'
import { $playlistTree } from '@app/state/playlists/playlistTree'
import { collectPlaylistIds } from './collectPlaylistIds'

export function collectPlaylists(id: string, tree: Tree = $playlistTree()): Playlist[] {
    return collectPlaylistIds(id)
        .map(id => tree.nodes.get(id)?.playlist)
        .filter(playlist => !!playlist)
}
