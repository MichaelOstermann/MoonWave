import { syncLibrary } from '@app/actions/app/syncLibrary'
import { createPlaylist } from '@app/actions/playlists/createPlaylist'
import { deletePlaylist } from '@app/actions/playlists/deletePlaylist'
import { editPlaylistTitle } from '@app/actions/playlists/editPlaylistTitle'
import { onClickPlaylist } from '@app/actions/playlists/onClickPlaylist'
import { onDragEnterPlaylist } from '@app/actions/playlists/onDragEnterPlaylist'
import { onDragLeavePlaylist } from '@app/actions/playlists/onDragLeavePlaylist'
import { onDragStartPlaylists } from '@app/actions/playlists/onDragStartPlaylists'
import { resetPlaylistIcon } from '@app/actions/playlists/resetPlaylistIcon'
import { savePlaylistTitle } from '@app/actions/playlists/savePlaylistTitle'
import { setPlaylistColor } from '@app/actions/playlists/setPlaylistColor'
import { setPlaylistIcon } from '@app/actions/playlists/setPlaylistIcon'
import { icons } from '@app/config/icons'
import { $isPlaying } from '@app/state/audio/isPlaying'
import { $dropPlaylistId } from '@app/state/playlists/dropPlaylistId'
import { $dropPlaylistSide } from '@app/state/playlists/dropPlaylistSide'
import { $editingPlaylistId } from '@app/state/playlists/editingPlaylistId'
import { $isDraggingPlaylists } from '@app/state/playlists/isDraggingPlaylists'
import { $playlistsById } from '@app/state/playlists/playlistsById'
import { $viewingPlaylistId } from '@app/state/playlists/viewingPlaylistId'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { $playingView } from '@app/state/sidebar/playingView'
import { $isDraggingTracks } from '@app/state/tracks/isDraggingTracks'
import { useMenu } from '@app/utils/menu'
import { PopoverRoot } from '@app/utils/modals/components/PopoverRoot'
import { usePopover } from '@app/utils/modals/usePopover'
import { getPlaylistDepth } from '@app/utils/playlist/getPlaylistDepth'
import { useSignal } from '@monstermann/signals'
import { confirm } from '@tauri-apps/plugin-dialog'
import { LucideListMusic } from 'lucide-react'
import { memo, type ReactNode } from 'react'
import { IconPicker } from './IconPicker'
import { LibraryItemTitle } from './LibraryItemTitle'
import { PlaylistItemIcon } from './PlaylistItemIcon'
import { SidebarItem } from './SidebarItem'

// Requires a memo, see: https://github.com/reactwg/react-compiler/discussions/58
export const PlaylistItem = memo(({ id }: { id: string }): ReactNode => {
    const playlistTitle = useSignal(() => $playlistsById(id)()?.title || '')
    const playlistIcon = useSignal(() => $playlistsById(id)()?.icon)
    const playlistColor = useSignal(() => $playlistsById(id)()?.color)
    const depth = useSignal(() => getPlaylistDepth(id))
    const isEditing = useSignal(() => $editingPlaylistId() === id)
    const isFocused = useSignal(() => $focusedView() === 'SIDEBAR')
    const isSelected = useSignal(() => $viewingPlaylistId() === id)
    const isActive = isFocused && isSelected
    const isDropTarget = useSignal(() => $dropPlaylistId() === id)
    const dropTarget = useSignal(() => {
        if (!isDropTarget) return undefined
        if ($isDraggingPlaylists()) return $dropPlaylistSide()
        return 'inside'
    })
    const isPlaying = useSignal(() => {
        if (!$isPlaying()) return false
        const view = $playingView()
        return view?.name === 'PLAYLIST'
            && view.value === id
    })

    const popover = usePopover(id, { paddingTop: 25, offset: 8 })
    const isPopoverOpen = useSignal(popover.isOpen)

    const menu = useMenu([
        { text: 'Edit Title', action: () => editPlaylistTitle(id) },
        { text: 'Edit Icon', action: popover.open },
        () => playlistIcon || playlistColor
            ? { text: 'Reset Icon', action: () => resetPlaylistIcon(id) }
            : undefined,
        { item: 'Separator' },
        { text: 'New Playlist', action: () => createPlaylist(id) },
        { text: 'Sync Library', action: syncLibrary },
        { item: 'Separator' },
        { text: 'Delete Playlist', action: async () => {
            const answer = await confirm(`Are you sure you want to delete the playlist "${playlistTitle}"?`, {
                title: '',
                kind: 'warning',
                okLabel: 'Delete',
                cancelLabel: 'Cancel',
            })
            if (!answer) return
            deletePlaylist(id)
        } },
    ])

    const showBorder = menu.isOpen || isPopoverOpen || isEditing || dropTarget === 'inside'
    const icon = playlistIcon
        ? icons[playlistIcon.value] ?? LucideListMusic
        : LucideListMusic

    return (
        <SidebarItem
            draggable
            depth={depth}
            color={playlistColor}
            isSelected={isSelected}
            isActive={isActive}
            isPlaying={isPlaying}
            isEditing={isEditing}
            showBorder={showBorder}
            dropTarget={dropTarget}
            data-playlist-id={id}
            onClick={() => onClickPlaylist(id)}
            onDragStart={function (evt) {
                evt.preventDefault()
                if (isEditing) return
                onDragStartPlaylists(id)
            }}
            onMouseOver={function () {
                if (!$isDraggingTracks() && !$isDraggingPlaylists()) return
                if (isDropTarget) return
                onDragEnterPlaylist(id)
            }}
            onMouseLeave={function () {
                if (!isDropTarget) return
                onDragLeavePlaylist(id)
            }}
            onContextMenu={menu.show}
        >
            <PlaylistItemIcon
                id={id}
                icon={icon}
                popover={popover}
                isPlaying={isPlaying}
                isEditing={isEditing}
            />
            <PopoverRoot
                popover={popover}
                render={() => (
                    <IconPicker
                        activeIcon={playlistIcon}
                        activeColor={playlistColor}
                        onSelectIcon={icon => setPlaylistIcon({ playlistId: id, icon })}
                        onSelectColor={color => setPlaylistColor({ playlistId: id, color })}
                    />
                )}
            />
            <LibraryItemTitle
                title={playlistTitle}
                isEditing={isEditing}
                onSubmit={savePlaylistTitle}
            />
        </SidebarItem>
    )
})
