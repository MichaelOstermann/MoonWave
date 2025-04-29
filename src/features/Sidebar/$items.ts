import type { PlaylistTreeNode } from "#features/PlaylistTree"
import type { SidebarItem } from "."
import type { View } from "../Views"
import { Playlists } from "#features/Playlists"
import { PlaylistTree } from "#features/PlaylistTree"
import { Array } from "@monstermann/fn"
import { memo } from "@monstermann/signals"

const $playlistIds = memo(collectPlaylistIds, {
    equals: Array.isShallowEqual,
})

export const $items = memo<SidebarItem[]>(() => {
    return [
        { name: "SECTION", value: "Home" },
        { name: "LIBRARY" },
        { name: "UNSORTED" },
        { name: "RECENTLY_ADDED" },
        { name: "SECTION", value: "Playlists" },
        ...$playlistIds().map<View>(value => ({ name: "PLAYLIST", value })),
    ]
})

function collectPlaylistIds(): string[] {
    const result: string[] = []
    const tree = PlaylistTree.create(Playlists.$all())

    for (const node of tree.children) {
        result.push(node.playlist.id)
        collectExpandedChildren(node, result)
    }

    return result
}

function collectExpandedChildren(node: PlaylistTreeNode, result: string[]): void {
    if (!node.playlist.expanded) return
    for (const child of node.children) {
        result.push(child.playlist.id)
        collectExpandedChildren(child, result)
    }
}
