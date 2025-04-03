import type { Tree } from './createPlaylistTree'
import { $playlistTree } from '@app/state/playlists/playlistTree'

export function hasPlaylistChildren(id: string, tree: Tree = $playlistTree()): boolean {
    return (tree.nodes.get(id)?.children.length ?? 0) > 0
}
