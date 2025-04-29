import type { PlaylistTree } from "."
import type { Playlist } from "../Playlists"

export function children(tree: PlaylistTree, id: string): Playlist[] {
    return tree.nodes.get(id)?.children.map(node => node.playlist) ?? []
}
