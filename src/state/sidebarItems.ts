import type { SidebarItem, View } from '@app/types'
import { computed } from '@app/utils/signals/computed'
import { shallowEqualArrays } from 'shallow-equal'
import { $playlists } from './playlists'

const $playlistIds = computed(() => $playlists().map(p => p.id), {
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
