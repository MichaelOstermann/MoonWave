import type { ReactNode } from "react"
import { selectAndImportFiles } from "#actions/app/selectAndImportFiles"
import { syncLibrary } from "#actions/app/syncLibrary"
import { createPlaylist } from "#actions/playlists/createPlaylist"
import { deletePlaylist } from "#actions/playlists/deletePlaylist"
import { editPlaylistTitle } from "#actions/playlists/editPlaylistTitle"
import { onClickPlaylist } from "#actions/playlists/onClickPlaylist"
import { onDoubleClickPlaylist } from "#actions/playlists/onDoubleClickPlaylist"
import { onDragEnterPlaylist } from "#actions/playlists/onDragEnterPlaylist"
import { onDragLeavePlaylist } from "#actions/playlists/onDragLeavePlaylist"
import { onDragStartPlaylists } from "#actions/playlists/onDragStartPlaylists"
import { resetPlaylistIcon } from "#actions/playlists/resetPlaylistIcon"
import { savePlaylistTitle } from "#actions/playlists/savePlaylistTitle"
import { setPlaylistColor } from "#actions/playlists/setPlaylistColor"
import { setPlaylistIcon } from "#actions/playlists/setPlaylistIcon"
import { Menu } from "#components/Core/Menu"
import { Popover } from "#components/Core/Popover"
import { icons } from "#config/icons"
import { Playback } from "#features/Playback"
import { Playlists } from "#features/Playlists"
import { PlaylistTree } from "#features/PlaylistTree"
import { Sidebar } from "#features/Sidebar"
import { TrackList } from "#features/TrackList"
import { Views } from "#features/Views"
import { useModal } from "#hooks/useModal"
import { Modals } from "#src/features/Modals"
import { useSignal } from "@monstermann/signals-react"
import { confirm } from "@tauri-apps/plugin-dialog"
import { LucideCirclePlus, LucideImport, LucideListMusic, LucidePen, LucideRefreshCw, LucideSmile, LucideTrash, LucideUndo2 } from "lucide-react"
import { memo } from "react"
import { IconPicker } from "./IconPicker"
import { LibraryItemTitle } from "./LibraryItemTitle"
import { PlaylistItemIcon } from "./PlaylistItemIcon"
import { SidebarItem } from "./SidebarItem"

// Requires a memo, see: https://github.com/reactwg/react-compiler/discussions/58
export const PlaylistItem = memo(({ id }: { id: string }): ReactNode => {
    const playlistTitle = Playlists.$byId.get(id)?.title || ""
    const playlistIcon = Playlists.$byId.get(id)?.icon
    const playlistColor = Playlists.$byId.get(id)?.color
    const depth = PlaylistTree.depth(PlaylistTree.$tree(), id)
    const isEditing = Sidebar.$editingId() === id
    const isFocused = Views.$focused() === "SIDEBAR"
    const isSelected = Sidebar.$playlistId() === id
    const isActive = isFocused && isSelected
    const isDropTarget = Sidebar.$dropId() === id
    const dropTarget = useSignal(() => {
        if (!isDropTarget) return undefined
        return Sidebar.$dropSide()
    })
    const isPlaying = useSignal(() => {
        if (!Playback.$isPlaying()) return false
        return Views.matches(Views.$playing(), {
            name: "PLAYLIST",
            value: id,
        })
    })

    const contextMenu = useModal(() => Modals.createContextMenu({ key: `context-${id}` }))
    const iconPopover = useModal(() => Modals.createPopover({ key: `icons-${id}` }))
    const isPopoverOpen = (iconPopover?.$isOpen() || contextMenu?.$isOpen()) ?? false

    const showBorder = isPopoverOpen || isEditing || dropTarget === "inside"
    const icon = playlistIcon
        ? icons[playlistIcon.value] ?? LucideListMusic
        : LucideListMusic

    return (
        <SidebarItem
            draggable
            color={playlistColor}
            data-playlist-id={id}
            depth={depth}
            dropTarget={dropTarget}
            isActive={isActive}
            isEditing={isEditing}
            isPlaying={isPlaying}
            isSelected={isSelected}
            onClick={() => onClickPlaylist(id)}
            ref={el => iconPopover?.$anchorElement(el)}
            showBorder={showBorder}
            onContextMenu={(evt) => {
                evt.preventDefault()
                evt.stopPropagation()
                contextMenu?.open()
            }}
            onDoubleClick={() => onDoubleClickPlaylist({
                name: "PLAYLIST",
                value: id,
            })}
            onDragStart={function (evt) {
                evt.preventDefault()
                if (isEditing) return
                onDragStartPlaylists(id)
            }}
            onMouseLeave={function () {
                if (!isDropTarget) return
                onDragLeavePlaylist(id)
            }}
            onMouseOver={function () {
                if (!TrackList.$isDragging() && !Sidebar.$isDragging()) return
                if (isDropTarget) return
                onDragEnterPlaylist(id)
            }}
        >
            <PlaylistItemIcon
                icon={icon}
                id={id}
                isEditing={isEditing}
                isPlaying={isPlaying}
                isPopoverOpen={isPopoverOpen}
            />
            <LibraryItemTitle
                isEditing={isEditing}
                onSubmit={savePlaylistTitle}
                title={playlistTitle}
            />
            <Popover.Root popover={iconPopover}>
                <Popover.Floating>
                    <Popover.Content>
                        <IconPicker
                            activeColor={playlistColor}
                            activeIcon={playlistIcon}
                            onSelectColor={color => setPlaylistColor({ color, playlistId: id })}
                            onSelectIcon={icon => setPlaylistIcon({ icon, playlistId: id })}
                        />
                    </Popover.Content>
                    <Popover.BackgroundBlur />
                </Popover.Floating>
            </Popover.Root>
            <Popover.Root popover={contextMenu}>
                <Popover.Floating>
                    <Popover.Content>
                        <Menu.Root>
                            <Menu.Item
                                icon={LucidePen}
                                onSelect={() => editPlaylistTitle(id)}
                                text="Edit Title"
                            />
                            <Menu.Item
                                icon={LucideSmile}
                                onSelect={() => iconPopover?.open()}
                                text="Edit Icon"
                            />
                            {playlistIcon || playlistColor
                                ? (
                                        <Menu.Item
                                            icon={LucideUndo2}
                                            onSelect={() => resetPlaylistIcon(id)}
                                            text="Reset Icon"
                                        />
                                    )
                                : null}
                            <Menu.Item
                                icon={LucideCirclePlus}
                                onSelect={() => createPlaylist(id)}
                                text="New Playlist"
                            />
                            <Menu.Item
                                icon={LucideTrash}
                                text="Delete Playlist"
                                onSelect={async function () {
                                    const answer = await confirm(`Are you sure you want to delete the playlist "${playlistTitle}"?`, {
                                        cancelLabel: "Cancel",
                                        kind: "warning",
                                        okLabel: "Delete",
                                        title: "",
                                    })
                                    if (!answer) return
                                    deletePlaylist(id)
                                }}
                            />
                            <Menu.Item
                                icon={LucideImport}
                                onSelect={() => selectAndImportFiles({ playlistId: id })}
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
        </SidebarItem>
    )
})
