import type { PlaylistTree, PlaylistTreeNode } from "."

export function parentIds(tree: PlaylistTree, id: string): string[] {
    const result: string[] = []
    let node: PlaylistTreeNode | undefined = tree.nodes.get(id)?.parent
    while (node) {
        result.unshift(node.playlist.id)
        node = node.parent
    }
    return result
}
