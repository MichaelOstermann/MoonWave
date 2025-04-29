import type { PlaylistTree, PlaylistTreeNode } from "."

export function collectIds(tree: PlaylistTree, id: string): string[] {
    const node = tree.nodes.get(id)
    if (!node) return []

    const result: string[] = []
    const queue: PlaylistTreeNode[] = [node]

    while (queue.length) {
        const next = queue.shift()!
        result.push(next.playlist.id)
        if (!next.children) continue
        queue.unshift(...next.children)
    }

    return result
}
