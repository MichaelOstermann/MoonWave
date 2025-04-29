import type { Playlist } from "../Playlists"

export type PlaylistTree = {
    children: PlaylistTreeNode[]
    nodes: Map<string, PlaylistTreeNode>
}

export type PlaylistTreeNode = {
    children: PlaylistTreeNode[]
    depth: number
    parent?: PlaylistTreeNode
    playlist: Playlist
}
