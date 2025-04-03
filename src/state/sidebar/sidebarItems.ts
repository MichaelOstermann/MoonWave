import type { SidebarItem, View } from '@app/types'
import type { Node } from '@app/utils/playlist/createPlaylistTree'
import { computed } from '@monstermann/signals'
import { shallowEqualArrays } from 'shallow-equal'
import { $playlistTree } from '../playlists/playlistTree'

const $playlistIds = computed(collectPlaylistIds, {
    equals: shallowEqualArrays,
})

export const $sidebarItems = computed<SidebarItem[]>(() => {
    return [
        { name: 'SECTION', value: 'Home' },
        { name: 'LIBRARY' },
        { name: 'UNSORTED' },
        { name: 'RECENTLY_ADDED' },
        { name: 'SECTION', value: 'Playlists' },
        ...$playlistIds().map<View>(value => ({ name: 'PLAYLIST', value })),
    ]
})

function collectPlaylistIds(): string[] {
    const result: string[] = []
    const tree = $playlistTree()

    for (const node of tree.children) {
        result.push(node.playlist.id)
        collectExpandedChildren(node, result)
    }

    return result
}

function collectExpandedChildren(node: Node, result: string[]): void {
    if (!node.playlist.expanded) return
    for (const child of node.children) {
        result.push(child.playlist.id)
        collectExpandedChildren(child, result)
    }
}
