import type { Node, Tree } from './createPlaylistTree'
import { $playlistTree } from '@app/state/playlists/playlistTree'

export function collectPlaylistIds(id: string, tree: Tree = $playlistTree()): string[] {
    const node = tree.nodes.get(id)
    if (!node) return []

    const result: string[] = []
    const queue: Node[] = [node]

    while (queue.length) {
        const next = queue.shift()!
        result.push(next.playlist.id)
        if (!next.children) continue
        queue.unshift(...next.children)
    }

    return result
}
