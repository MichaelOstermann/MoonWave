import type { ReactNode } from 'react'
import { createPlaylist } from '@app/actions/createPlaylist'
import { deletePlaylist } from '@app/actions/deletePlaylist'
import { editPlaylistTitle } from '@app/actions/editPlaylistTitle'
import { onClickPlaylist } from '@app/actions/onClickPlaylist'
import { onDragEnterPlaylist } from '@app/actions/onDragEnterPlaylist'
import { onDragLeavePlaylist } from '@app/actions/onDragLeavePlaylist'
import { onDragStartPlaylists } from '@app/actions/onDragStartPlaylists'
import { resetPlaylistIcon } from '@app/actions/resetPlaylistIcon'
import { savePlaylistTitle } from '@app/actions/savePlaylistTitle'
import { setPlaylistColor } from '@app/actions/setPlaylistColor'
import { setPlaylistIcon } from '@app/actions/setPlaylistIcon'
import { syncLibrary } from '@app/actions/syncLibrary'
import { $draggingPlaylistIds } from '@app/state/draggingPlaylistIds'
import { $dropPlaylistId } from '@app/state/dropPlaylistId'
import { $dropPlaylistSide } from '@app/state/dropPlaylistSide'
import { $editingPlaylistId } from '@app/state/editingPlaylistId'
import { $focusedView } from '@app/state/focusedView'
import { $isDraggingPlaylists } from '@app/state/isDraggingPlaylists'
import { $isDraggingTracks } from '@app/state/isDraggingTracks'
import { $isPlaying } from '@app/state/isPlaying'
import { $playingView } from '@app/state/playingView'
import { $playlistsById } from '@app/state/playlistsById'
import { $view } from '@app/state/view'
import { useMenu } from '@app/utils/menu'
import { PopoverRoot } from '@app/utils/modals/components/PopoverRoot'
import { PopoverTarget } from '@app/utils/modals/components/PopoverTarget'
import { usePopover } from '@app/utils/modals/usePopover'
import { useSignal } from '@app/utils/signals/useSignal'
import { confirm } from '@tauri-apps/plugin-dialog'
import { DynamicIcon } from 'lucide-react/dynamic'
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
    const isSelected = useSignal(() => {
        const view = $view()
        return view.name === 'PLAYLIST'
            && view.value === id
    })
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

    const popover = usePopover(id, { paddingTop: 25 })
    const isPopoverOpen = useSignal(popover.isOpen)
    const popoverSide = useSignal(popover.placement)

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
                    <FadeInOut animateInitial={false} show={showAudioWaveIcon} className="absolute">
                        <AudioWaveIcon className="mb-1 size-4" />
                    </FadeInOut>
                    <FadeInOut animateInitial={false} show={!showAudioWaveIcon} className="absolute">
                        <DynamicIcon name={playlist.icon ? playlist.icon.value : 'list-music'} className="size-4" />
                    </FadeInOut>
                </LibraryItemIcon>
            </PopoverTarget>
            <PopoverRoot
                popover={popover}
                render={() => (
                    <IconPicker
                        side={popoverSide}
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
