import type { Playlist } from '@app/types'
import type { Tree } from './createPlaylistTree'
import { $playlistTree } from '@app/state/playlists/playlistTree'
import { getPlaylistParentIds } from './getPlaylistParentIds'

export function getPlaylistParents(id: string, tree: Tree = $playlistTree()): Playlist[] {
    return getPlaylistParentIds(id, tree)
        .map(pid => tree.nodes.get(pid)?.playlist)
        .filter(p => !!p)
}
