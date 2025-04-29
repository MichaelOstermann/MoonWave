import type { ReactNode } from "react"
import { selectAndImportFiles } from "#actions/app/selectAndImportFiles"
import { syncLibrary } from "#actions/app/syncLibrary"
import { createPlaylist } from "#actions/playlists/createPlaylist"
import { Menu } from "#components/Core/Menu"
import { Popover } from "#components/Core/Popover"
import { Sidebar } from "#features/Sidebar"
import { Views } from "#features/Views"
import { useModal } from "#hooks/useModal"
import { Modals } from "#src/features/Modals"
import { LucideCirclePlus, LucideImport, LucideRefreshCw } from "lucide-react"
import { LibraryView } from "./Home/Library"
import { RecentlyAdded } from "./Home/RecentlyAdded"
import { Unsorted } from "./Home/Unsorted"
import { PlaylistDragGhost } from "./PlaylistDragGhost"
import { PlaylistItem } from "./PlaylistItem"
import { SidebarSearchInput } from "./SidebarSearchInput"
import { SidebarSectionHeader } from "./SidebarSectionHeader"

export function SidebarView(): ReactNode {
    const sidebarItems = Sidebar.$items()
    const width = Sidebar.$width()
    const contextMenu = useModal(() => Modals.createContextMenu({ key: "sidebar" }))

    return (
        <div
            className="sidebar absolute inset-y-0 left-0 flex flex-col border-r border-(--border) bg-(--bg) text-(--fg)"
            onClick={() => Views.$focused("SIDEBAR")}
            style={{ width }}
            onContextMenu={function (evt) {
                evt.preventDefault()
                evt.stopPropagation()
                contextMenu?.open()
            }}
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
                        case "SECTION": return (
                            <SidebarSectionHeader key={`section-${item.value}`}>
                                {item.value}
                            </SidebarSectionHeader>
                        )
                        case "LIBRARY": return <LibraryView key={item.name} />
                        case "RECENTLY_ADDED": return <RecentlyAdded key={item.name} />
                        case "UNSORTED": return <Unsorted key={item.name} />
                        case "PLAYLIST": return <PlaylistItem id={item.value} key={`playlist-${item.value}`} />
                    }
                    return null
                })}
                <div
                    data-tauri-drag-region
                    className="flex shrink grow"
                    onClick={evt => evt.stopPropagation()}
                />
            </div>
            <Popover.Root popover={contextMenu}>
                <Popover.Floating>
                    <Popover.Content>
                        <Menu.Root>
                            <Menu.Item
                                icon={LucideCirclePlus}
                                onSelect={createPlaylist}
                                text="New Playlist"
                            />
                            <Menu.Item
                                icon={LucideImport}
                                onSelect={() => selectAndImportFiles({ playlistId: undefined })}
                                text="Import Tracks"
                            />
                            <Menu.Item
                                icon={LucideRefreshCw}
                                onSelect={syncLibrary}
                                text="Update Library"
                            />
                        </Menu.Root>
                    </Popover.Content>
                    <Popover.BackgroundBlur />
                </Popover.Floating>
            </Popover.Root>
        </div>
    )
}
