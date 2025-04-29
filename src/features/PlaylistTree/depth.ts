import type { PlaylistTree } from "."

export function depth(tree: PlaylistTree, id: string): number {
    return tree.nodes.get(id)?.depth ?? 0
}
