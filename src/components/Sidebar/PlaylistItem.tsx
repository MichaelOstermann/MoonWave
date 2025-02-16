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
import { $draggingPlaylistIds, $dropPlaylistId, $dropPlaylistSide, $editingPlaylistId, $focusedView, $isDraggingPlaylists, $isDraggingTracks, $playing, $playingView, $playlistsById, $view } from '@app/state/state'
import { useMenu } from '@app/utils/menu'
import { PopoverRoot } from '@app/utils/modals/components/PopoverRoot'
import { PopoverTarget } from '@app/utils/modals/components/PopoverTarget'
import { usePopover } from '@app/utils/modals/usePopover'
import { useSignal } from '@app/utils/signals/useSignal'
import { confirm } from '@tauri-apps/plugin-dialog'
import { IconPicker } from './IconPicker'
import { LibraryItemIcon } from './LibraryItemIcon'
import { LibraryItemTitle } from './LibraryItemTitle'
import { SidebarItem } from './SidebarItem'

export function PlaylistItem({ id }: { id: string }): ReactNode {
    const playlist = useSignal($playlistsById(id))!
    const isEditing = useSignal(() => $editingPlaylistId() === id)
    const isFocused = useSignal(() => $focusedView.value === 'SIDEBAR')
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
        if (!$playing()) return false
        const view = $playingView()
        return view?.name === 'PLAYLIST'
            && view.value === id
    })

    const popover = usePopover(id)
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
    const showBorder = menu.isOpen || isPopoverOpen || isEditing || dropTarget === true

    return (
        <SidebarItem
            draggable
            color={playlist.color}
            isSelected={isSelected}
            isActive={isActive}
            isPlaying={isPlaying}
            isEditing={isEditing}
            isDragging={isDragging}
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
                <LibraryItemIcon
                    wave={showAudioWaveIcon}
                    icon={playlist.icon}
                />
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
            <div className="flex shrink grow">
                {!isEditing && (
                    <LibraryItemTitle title={playlist.title} />
                )}
                {isEditing && (
                    <input
                        autoFocus
                        type="text"
                        defaultValue={playlist.title}
                        placeholder="New Playlist"
                        className="shrink grow border-0 bg-transparent outline-none placeholder:text-[--fg-soft]"
                        onBlur={evt => savePlaylistTitle(evt.target.value || 'New Playlist')}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Escape' || evt.key === 'Enter')
                                (evt.target as HTMLInputElement).blur()
                        }}
                    />
                )}
            </div>
        </SidebarItem>
    )
}
