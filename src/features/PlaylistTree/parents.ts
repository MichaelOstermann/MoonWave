import type { Playlist } from "../Playlists"
import { PlaylistTree } from "."

export function parents(tree: PlaylistTree, id: string): Playlist[] {
    return PlaylistTree
        .parentIds(tree, id)
        .map(pid => tree.nodes.get(pid)?.playlist)
        .filter(p => !!p)
}
