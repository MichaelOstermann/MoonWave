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
import { $draggingPlaylistIds } from '@app/state/playlists/draggingPlaylistIds'
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
import { PopoverTarget } from '@app/utils/modals/components/PopoverTarget'
import { usePopover } from '@app/utils/modals/usePopover'
import { useSignal } from '@monstermann/signals'
import { confirm } from '@tauri-apps/plugin-dialog'
import { LucideListMusic } from 'lucide-react'
import { createElement, type ReactNode } from 'react'
import { AudioWaveIcon } from '../AudioWaveIcon'
import { FadeInOut } from '../FadeInOut'
import { IconPicker } from './IconPicker'
import { LibraryItemIcon } from './LibraryItemIcon'
import { LibraryItemTitle } from './LibraryItemTitle'
import { SidebarItem } from './SidebarItem'

export function PlaylistItem({ id }: { id: string }): ReactNode {
    const playlist = useSignal($playlistsById(id))!
    const isEditing = useSignal(() => $editingPlaylistId() === id)
    const isFocused = useSignal(() => $focusedView() === 'SIDEBAR')
    const isSelected = useSignal(() => $viewingPlaylistId() === id)
    const isActive = isFocused && isSelected
    const isDragging = useSignal(() => $draggingPlaylistIds().includes(id))
    const isDropTarget = useSignal(() => $dropPlaylistId() === id)
    const dropTarget = useSignal(() => isDropTarget && $isDraggingPlaylists() ? $dropPlaylistSide() : isDropTarget)

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
        () => playlist.icon || playlist.color
            ? { text: 'Reset Icon', action: () => resetPlaylistIcon(id) }
            : undefined,
        { item: 'Separator' },
        { text: 'New Playlist', action: () => createPlaylist(id) },
        { text: 'Sync Library', action: syncLibrary },
        { item: 'Separator' },
        { text: 'Delete Playlist', action: async () => {
            const answer = await confirm(`Are you sure you want to delete the playlist "${playlist.title}"?`, {
                title: '',
                kind: 'warning',
                okLabel: 'Delete',
                cancelLabel: 'Cancel',
            })
            if (!answer) return
            deletePlaylist(id)
        } },
    ])

    const showAudioWaveIcon = !isPopoverOpen && isPlaying
    const showBorder = menu.isOpen || isDragging || isPopoverOpen || isEditing || dropTarget === true
    const icon = playlist.icon
        ? icons[playlist.icon.value] ?? LucideListMusic
        : LucideListMusic

    return (
        <SidebarItem
            draggable
            color={playlist.color}
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
            <PopoverTarget asChild popover={popover}>
                <LibraryItemIcon>
                    <FadeInOut show={showAudioWaveIcon} className="absolute">
                        <AudioWaveIcon className="mb-1 size-4" />
                    </FadeInOut>
                    <FadeInOut show={!showAudioWaveIcon} className="absolute">
                        {createElement(icon, { className: 'size-4' })}
                    </FadeInOut>
                </LibraryItemIcon>
            </PopoverTarget>
            <PopoverRoot
                popover={popover}
                render={() => (
                    <IconPicker
                        activeIcon={playlist.icon}
                        activeColor={playlist.color}
                        onSelectIcon={icon => setPlaylistIcon({ playlistId: id, icon })}
                        onSelectColor={color => setPlaylistColor({ playlistId: id, color })}
                    />
                )}
            />
            <LibraryItemTitle
                title={playlist.title}
                isEditing={isEditing}
                onSubmit={savePlaylistTitle}
            />
        </SidebarItem>
    )
}
