import type { Node, Tree } from './createPlaylistTree'
import { $playlistTree } from '@app/state/playlists/playlistTree'

export function getPlaylistParentIds(id: string, tree: Tree = $playlistTree()): string[] {
    const result: string[] = []
    let node: Node | undefined = tree.nodes.get(id)?.parent
    while (node) {
        result.unshift(node.playlist.id)
        node = node.parent
    }
    return result
}
