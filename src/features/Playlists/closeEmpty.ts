import type { Playlist } from "."
import { PlaylistTree } from "#features/PlaylistTree"
import { Array, Object } from "@monstermann/fn"

export function closeEmpty(playlists: Playlist[]): Playlist[] {
    const tree = PlaylistTree.create(playlists)
    return Array.mapEach(playlists, (p) => {
        if (!p.expanded) return p
        if (PlaylistTree.hasChildren(tree, p.id)) return p
        return Object.merge(p, { expanded: undefined })
    })
}
