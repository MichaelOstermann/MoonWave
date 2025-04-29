import type { PlaylistTree, PlaylistTreeNode } from "."
import type { Playlist } from "../Playlists"

export function create(playlists: Playlist[]): PlaylistTree {
    const tree: PlaylistTree = {
        children: [],
        nodes: new Map(),
    }

    for (const playlist of playlists) {
        const node: PlaylistTreeNode = { children: [], depth: 0, playlist }
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
