import type { ReactNode } from 'react'
import { createPlaylist } from '@app/actions/createPlaylist'
import { deletePlaylist } from '@app/actions/deletePlaylist'
import { editPlaylistTitle } from '@app/actions/editPlaylistTitle'
import { onClickPlaylist } from '@app/actions/onClickPlaylist'
import { onDragEnterPlaylist } from '@app/actions/onDragEnterPlaylist'
import { onDragLeavePlaylist } from '@app/actions/onDragLeavePlaylist'
import { savePlaylistTitle } from '@app/actions/savePlaylistTitle'
import { syncLibrary } from '@app/actions/syncLibrary'
import { $dropPlaylistId, $editingPlaylistId, $isDraggingTracks, $playing, $playingView, $playlistsById, $view } from '@app/state/state'
import { useMenu } from '@app/utils/menu'
import { useComputed } from '@preact/signals-react'
import { confirm } from '@tauri-apps/plugin-dialog'
import { LucideListMusic, LucideVolume, LucideVolume2 } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { SidebarItemIcon } from './SidebarItemIcon'

// TODO optimize
export function PlaylistItem({ id }: {
    id: string
}): ReactNode {
    const playlist = $playlistsById(id).value!
    const view = $view.value
    const isEditing = $editingPlaylistId.value === playlist.id
    const isActive = view.name === 'PLAYLIST' && view.value === playlist.id
    const isDraggingTracks = $isDraggingTracks.value
    const isDropTarget = isDraggingTracks && $dropPlaylistId.value === playlist.id

    const isPlayingPlaylist = useComputed(() => {
        const view = $playingView.value
        if (view?.name !== 'PLAYLIST') return false
        return view.value === playlist.id
    }).value

    const menu = useMenu([
        { text: 'Create Playlist', action: createPlaylist },
        { text: 'Sync Library', action: syncLibrary },
        { item: 'Separator' },
        { text: 'Edit Playlist', action: () => editPlaylistTitle(playlist.id) },
        { text: 'Delete Playlist', action: async () => {
            const answer = await confirm(`Are you sure you want to delete the playlist "${playlist.title}"?`, {
                title: '',
                kind: 'warning',
                okLabel: 'Delete',
                cancelLabel: 'Cancel',
            })
            if (!answer) return
            deletePlaylist(playlist.id)
        } },
    ])

    return (
        <SidebarItem
            isActive={isActive}
            hasMenu={menu.isOpen}
            isEditing={isEditing}
            isDropTarget={isDropTarget}
            onMouseDown={(evt) => {
                if (evt.button !== 0) return
                onClickPlaylist(playlist.id)
            }}
            onMouseOver={function () {
                if (!isDraggingTracks) return
                if (isDropTarget) return
                onDragEnterPlaylist(playlist.id)
            }}
            onMouseLeave={function () {
                if (!isDropTarget) return
                onDragLeavePlaylist(playlist.id)
            }}
            onContextMenu={menu.show}
        >
            <SidebarItemIcon icon={LucideListMusic} />
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
                        className="shrink grow border-0 bg-transparent outline-none placeholder:text-[--input-placeholder-fg]"
                        onBlur={evt => savePlaylistTitle(evt.target.value || 'New Playlist')}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Escape' || evt.key === 'Enter')
                                (evt.target as HTMLInputElement).blur()
                        }}
                    />
                )}
            </div>
            {isPlayingPlaylist && (
                <SidebarItemIcon icon={$playing.value
                    ? LucideVolume2
                    : LucideVolume}
                />
            )}
        </SidebarItem>
    )
}
