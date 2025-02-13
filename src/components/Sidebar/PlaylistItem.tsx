import type { PlaylistIcon } from '@app/types'
import { createPlaylist } from '@app/actions/createPlaylist'
import { deletePlaylist } from '@app/actions/deletePlaylist'
import { editPlaylistTitle } from '@app/actions/editPlaylistTitle'
import { onClickPlaylist } from '@app/actions/onClickPlaylist'
import { onDragEnterPlaylist } from '@app/actions/onDragEnterPlaylist'
import { onDragLeavePlaylist } from '@app/actions/onDragLeavePlaylist'
import { onDragStartPlaylists } from '@app/actions/onDragStartPlaylists'
import { savePlaylistTitle } from '@app/actions/savePlaylistTitle'
import { setPlaylistIcon } from '@app/actions/setPlaylistIcon'
import { syncLibrary } from '@app/actions/syncLibrary'
import { $draggingPlaylistIds, $dropPlaylistId, $dropPlaylistSide, $editingPlaylistId, $isDraggingPlaylists, $isDraggingTracks, $playing, $playingView, $playlistsById, $view } from '@app/state/state'
import { useMenu } from '@app/utils/menu'
import { PopoverRoot } from '@app/utils/modals/components/PopoverRoot'
import { PopoverTarget } from '@app/utils/modals/components/PopoverTarget'
import { usePopover } from '@app/utils/modals/usePopover'
import { useSignal } from '@app/utils/signals/useSignal'
import { confirm } from '@tauri-apps/plugin-dialog'
import { type ReactNode, useState } from 'react'
import { IconPicker } from './IconPicker'
import { PlaylistItemIcon } from './PlaylistItemIcon'
import { SidebarItem } from './SidebarItem'

export function PlaylistItem({ id }: {
    id: string
}): ReactNode {
    const playlist = useSignal($playlistsById(id))!
    const [previewIcon, setPreviewIcon] = useState<PlaylistIcon | undefined>(undefined)
    const view = useSignal($view)
    const isEditing = useSignal(() => $editingPlaylistId() === id)
    const isActive = view.name === 'PLAYLIST' && view.value === id
    const isDraggingAnyTrack = useSignal($isDraggingTracks)
    const isDraggingPlaylist = useSignal(() => $draggingPlaylistIds().includes(id))
    const isDraggingAnyPlaylist = useSignal($isDraggingPlaylists)
    const isDropTarget = useSignal(() => $dropPlaylistId() === id)
    const dropTarget = useSignal(() => isDropTarget && isDraggingAnyPlaylist ? $dropPlaylistSide() : isDropTarget)
    const isPlaying = useSignal($playing)
    const isPlaylingPlaylist = useSignal(() => {
        const view = $playingView()
        return view?.name === 'PLAYLIST'
            && view.value === id
    })

    const popover = usePopover(id, {
        onClose: () => setPreviewIcon(undefined),
    })

    const isPopoverOpen = useSignal(popover.isOpen)
    const popoverSide = useSignal(popover.placement)

    const showAudioWaveIcon = !isPopoverOpen && isPlaylingPlaylist && isPlaying
    const icon = isPopoverOpen ? previewIcon ?? playlist.icon : playlist.icon

    const menu = useMenu([
        { text: 'Edit Playlist', action: () => editPlaylistTitle(id) },
        { text: 'Edit Icon', action: popover.open },
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
        { item: 'Separator' },
        { text: 'Create Playlist', action: () => createPlaylist(id) },
        { text: 'Sync Library', action: syncLibrary },
    ])

    return (
        <SidebarItem
            draggable
            isActive={isActive}
            isPlaying={isPlaylingPlaylist}
            hasMenu={menu.isOpen}
            isEditing={isEditing}
            isDragging={isDraggingPlaylist}
            dropTarget={dropTarget}
            data-playlist-id={id}
            onClick={(evt) => {
                if (evt.button !== 0) return
                onClickPlaylist(id)
            }}
            onDragStart={function (evt) {
                evt.preventDefault()
                onDragStartPlaylists(id)
            }}
            onMouseOver={function () {
                if (!isDraggingAnyTrack && !isDraggingAnyPlaylist) return
                if (isDropTarget) return
                onDragEnterPlaylist(id)
            }}
            onMouseLeave={function () {
                if (!isDropTarget) return
                onDragLeavePlaylist(id)
            }}
            onContextMenu={menu.show}
        >
            <PopoverTarget
                popover={popover}
                className="flex shrink-0"
            >
                <PlaylistItemIcon
                    wave={showAudioWaveIcon}
                    icon={icon}
                />
            </PopoverTarget>
            <PopoverRoot
                popover={popover}
                render={() => (
                    <IconPicker
                        side={popoverSide}
                        activeIcon={playlist.icon}
                        onHoverIcon={setPreviewIcon}
                        onSelectIcon={(icon) => {
                            popover.close()
                            setPlaylistIcon({ playlistId: id, icon })
                        }}
                    />
                )}
            />
            <div className="flex shrink grow">
                {!isEditing && (
                    <span className="truncate">
                        {playlist.title}
                    </span>
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
