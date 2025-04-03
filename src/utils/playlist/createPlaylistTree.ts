import type { Playlist } from '@app/types'
import { $playlists } from '@app/state/playlists/playlists'

export type Node = {
    playlist: Playlist
    depth: number
    parent?: Node
    children: Node[]
}

export type Tree = {
    nodes: Map<string, Node>
    children: Node[]
}

export function createPlaylistTree(playlists: Playlist[] = $playlists()): Tree {
    const tree: Tree = {
        nodes: new Map(),
        children: [],
    }

    for (const playlist of playlists) {
        const node: Node = { playlist, depth: 0, children: [] }
        tree.nodes.set(playlist.id, node)

        if (!playlist.parentId) {
            tree.children.push(node)
        }
        else {
            const parentNode = tree.nodes.get(playlist.parentId)
            if (!parentNode) continue
            node.parent = parentNode
            node.depth = parentNode.depth + 1
            parentNode.children.push(node)
        }
    }

    return tree
}
