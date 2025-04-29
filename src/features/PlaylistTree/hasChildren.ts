import type { PlaylistTree } from "."

export function hasChildren(tree: PlaylistTree, id: string): boolean {
    return (tree.nodes.get(id)?.children.length ?? 0) > 0
}
