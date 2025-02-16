import type { ReactNode } from 'react'
import { createPlaylist } from '@app/actions/createPlaylist'
import { syncLibrary } from '@app/actions/syncLibrary'
import { $config, $focusedView, $sidebarItems } from '@app/state/state'
import { useMenu } from '@app/utils/menu'
import { getSidebarWidth } from '@app/utils/sidebar/getSidebarWidth'
import { useSignal } from '@app/utils/signals/useSignal'
import { LibraryItem } from './LibraryItem'
import { PlaylistDragGhost } from './PlaylistDragGhost'
import { PlaylistItem } from './PlaylistItem'
import { SidebarResizeHandler } from './SidebarResizeHandler'
import { SidebarSearchInput } from './SidebarSearchInput'
import { SidebarSectionHeader } from './SidebarSectionHeader'

export function Sidebar(): ReactNode {
    const sidebarItems = useSignal($sidebarItems)
    const width = useSignal(() => getSidebarWidth($config.value.sidebarWidth))

    const menu = useMenu([
        { text: 'New Playlist', action: createPlaylist },
        { text: 'Sync Library', action: syncLibrary },
    ])

    return (
        <div
            onContextMenu={menu.show}
            style={{ width }}
            className="sidebar relative flex h-full shrink-0 flex-col bg-[--bg] text-[--fg]"
            onClick={(evt) => {
                if ((evt.target as Element).hasAttribute('data-tauri-drag-region')) return
                $focusedView.set('SIDEBAR')
            }}
        >
            <PlaylistDragGhost />
            <div
                data-tauri-drag-region
                className="h-11 shrink-0"
            />
            <SidebarResizeHandler />
            <SidebarSearchInput />
            <div className="mt-4 flex shrink grow flex-col overflow-auto px-2 pb-2">
                {sidebarItems.map((item) => {
                    switch (item.name) {
                        case 'SECTION': return (
                            <SidebarSectionHeader key={`section-${item.value}`}>
                                {item.value}
                            </SidebarSectionHeader>
                        )
                        case 'LIBRARY': return (
                            <LibraryItem name={item.name} key={item.name} />
                        )
                        case 'RECENTLY_ADDED': return (
                            <LibraryItem name={item.name} key={item.name} />
                        )
                        case 'UNSORTED': return (
                            <LibraryItem name={item.name} key={item.name} />
                        )
                        case 'PLAYLIST': return (
                            <PlaylistItem id={item.value} key={`playlist-${item.value}`} />
                        )
                    }
                    return null
                })}
                <div
                    data-tauri-drag-region
                    className="flex shrink grow"
                />
            </div>
        </div>
    )
}
