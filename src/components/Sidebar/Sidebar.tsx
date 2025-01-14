import type { ReactNode } from 'react'
import { createPlaylist } from '@app/actions/createPlaylist'
import { syncLibrary } from '@app/actions/syncLibrary'
import { $focusedView, $sidebarItems } from '@app/state/state'
import { useMenu } from '@app/utils/menu'
import { useSignal } from '@app/utils/signals/useSignal'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { LibraryItem } from './LibraryItem'
import { PlaylistItem } from './PlaylistItem'
import { SidebarSearchInput } from './SidebarSearchInput'
import { SidebarSectionHeader } from './SidebarSectionHeader'

export function Sidebar(): ReactNode {
    const sidebarItems = useSignal($sidebarItems)

    const menu = useMenu([
        { text: 'Create Playlist', action: createPlaylist },
        { item: 'Separator' },
        { text: 'Sync Library', action: syncLibrary },
    ])

    return (
        <div
            onContextMenu={menu.show}
            onMouseDown={() => $focusedView.set('SIDEBAR')}
            className="sidebar flex h-full w-72 shrink-0 flex-col bg-[--bg] text-[--fg]"
        >
            <div
                className="h-11 shrink-0"
                onMouseDown={(evt) => {
                    evt.preventDefault()
                    evt.stopPropagation()
                    getCurrentWindow().startDragging()
                }}
            />
            <SidebarSearchInput />
            <div className="mt-4 flex shrink grow flex-col overflow-auto px-2.5 pb-2.5">
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
