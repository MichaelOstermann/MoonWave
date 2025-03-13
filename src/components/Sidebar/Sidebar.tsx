import type { ReactNode } from 'react'
import { syncLibrary } from '@app/actions/app/syncLibrary'
import { createPlaylist } from '@app/actions/playlists/createPlaylist'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { $sidebarItems } from '@app/state/sidebar/sidebarItems'
import { $sidebarWidth } from '@app/state/sidebar/sidebarWidth'
import { useMenu } from '@app/utils/menu'
import { useSignal } from '@monstermann/signals'
import { Library } from './Home/Library'
import { RecentlyAdded } from './Home/RecentlyAdded'
import { Unsorted } from './Home/Unsorted'
import { PlaylistDragGhost } from './PlaylistDragGhost'
import { PlaylistItem } from './PlaylistItem'
import { SidebarSearchInput } from './SidebarSearchInput'
import { SidebarSectionHeader } from './SidebarSectionHeader'

export function Sidebar(): ReactNode {
    const sidebarItems = useSignal($sidebarItems)
    const width = useSignal($sidebarWidth)

    const menu = useMenu([
        { text: 'New Playlist', action: createPlaylist },
        { text: 'Sync Library', action: syncLibrary },
    ])

    return (
        <div
            onContextMenu={menu.show}
            style={{ width }}
            onClick={() => $focusedView.set('SIDEBAR')}
            className="sidebar absolute inset-y-0 left-0 flex flex-col border-r border-[--border] bg-[--bg] text-[--fg]"
        >
            <PlaylistDragGhost />
            <div
                data-tauri-drag-region
                className="h-11 shrink-0"
                onClick={evt => evt.stopPropagation()}
            />
            <SidebarSearchInput />
            <div className="playlists mt-4 flex shrink grow scroll-p-2 flex-col overflow-auto px-2 pb-2">
                {sidebarItems.map((item) => {
                    switch (item.name) {
                        case 'SECTION': return (
                            <SidebarSectionHeader key={`section-${item.value}`}>
                                {item.value}
                            </SidebarSectionHeader>
                        )
                        case 'LIBRARY': return <Library key={item.name} />
                        case 'RECENTLY_ADDED': return <RecentlyAdded key={item.name} />
                        case 'UNSORTED': return <Unsorted key={item.name} />
                        case 'PLAYLIST': return <PlaylistItem id={item.value} key={`playlist-${item.value}`} />
                    }
                    return null
                })}
                <div
                    data-tauri-drag-region
                    className="flex shrink grow"
                    onClick={evt => evt.stopPropagation()}
                />
            </div>
        </div>
    )
}
