import type { Playlist } from "../Playlists"
import { PlaylistTree } from "."

export function collect(tree: PlaylistTree, id: string): Playlist[] {
    return PlaylistTree
        .collectIds(tree, id)
        .map(id => tree.nodes.get(id)?.playlist)
        .filter(playlist => !!playlist)
}
