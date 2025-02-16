import type { MenuItem } from '@app/utils/menu'
import type { CSSProperties, ReactNode } from 'react'
import type { Column, Row } from './types'
import { addTracksToPlaylist } from '@app/actions/addTracksToPlaylist'
import { onClickTrack } from '@app/actions/onClickTrack'
import { onDoubleClickTrack } from '@app/actions/onDoubleClickTrack'
import { onDragStartTracks } from '@app/actions/onDragStartTracks'
import { removeTracksFromPlaylist } from '@app/actions/removeTracksFromPlaylist'
import { syncLibrary } from '@app/actions/syncLibrary'
import { trashTracks } from '@app/actions/trashTracks'
import { $focusedView, $playingTrackId, $playlists, $playlistsById, $tracksLSM, $view } from '@app/state/state'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { isFirstSelectionInGroup } from '@app/utils/lsm/utils/isFirstSelectionInGroup'
import { isLastSelectionInGroup } from '@app/utils/lsm/utils/isLastSelectionInGroup'
import { isSelected } from '@app/utils/lsm/utils/isSelected'
import { useMenu } from '@app/utils/menu'
import { useSignal } from '@app/utils/signals/useSignal'
import { formatTrackIds } from '@app/utils/track/formatTrackIds'
import { confirm } from '@tauri-apps/plugin-dialog'
import { twMerge } from 'tailwind-merge'
import { columns } from './config'
import { TrackListRowColumn } from './TrackListRowColumn'

export function TrackListRow({ row, idx, colStyles }: {
    row: Row
    idx: number
    colStyles: Record<Column, CSSProperties>
}): ReactNode {
    const isEven = idx % 2 === 0
    const isFocused = useSignal(() => $focusedView() === 'MAIN')
    const isPlaying = useSignal(() => $playingTrackId() === row.id)
    const selected = useSignal(() => isSelected($tracksLSM(), row.id))
    const isActive = isFocused && selected
    const firstSelected = useSignal(() => isFirstSelectionInGroup($tracksLSM(), row.id))
    const lastSelected = useSignal(() => isLastSelectionInGroup($tracksLSM(), row.id))

    const menu = useMenu([
        addSelectedTracksToPlaylistMenuItem,
        removeSelectedTracksToPlaylistMenuItem,
        { item: 'Separator' },
        { text: 'Sync Library', action: syncLibrary },
        { item: 'Separator' },
        moveSelectedTracksToTrash,
    ])

    return (
        <div
            draggable
            onClick={evt => onClickTrack({ evt, trackId: row.id })}
            onDoubleClick={() => onDoubleClickTrack(row.id)}
            className={twMerge(
                'relative flex h-8 items-center text-sm leading-7',
                isEven && !selected && 'bg-[--bg-soft]',
                isPlaying && 'text-[--fg-active]',
                selected && 'bg-[--bg-selected]',
                isActive && 'bg-[--bg-active] text-[--fg-active]',
                !selected && 'rounded-md',
                firstSelected && lastSelected && 'rounded-md',
                firstSelected && !lastSelected && 'rounded-t-md',
                !firstSelected && lastSelected && 'rounded-b-md',
            )}
            onDragStart={(evt) => {
                evt.preventDefault()
                onDragStartTracks(row.id)
            }}
            onContextMenu={(evt) => {
                onClickTrack({ evt, trackId: row.id })
                menu.show(evt)
            }}
        >
            {columns.map(col => (
                <TrackListRowColumn
                    key={col}
                    col={col}
                    row={row}
                    style={colStyles[col]}
                />
            ))}
        </div>
    )
}

function addSelectedTracksToPlaylistMenuItem(): MenuItem {
    const trackIds = getSelections($tracksLSM.value)
    const currentPlaylistId = $view.value.name === 'PLAYLIST'
        ? $view.value.value
        : null

    const playlists = $playlists.value
        .filter(playlist => playlist.id !== currentPlaylistId)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(playlist => ({
            text: playlist.title,
            action: () => addTracksToPlaylist({ trackIds, playlistId: playlist.id }),
        }))

    if (!playlists.length) return

    return {
        text: 'Add to Playlist',
        items: playlists,
    }
}

function removeSelectedTracksToPlaylistMenuItem(): MenuItem {
    const trackIds = getSelections($tracksLSM.value)
    if (!trackIds.length) return

    const currentPlaylistId = $view.value.name === 'PLAYLIST'
        ? $view.value.value
        : null

    const playlist = $playlistsById(currentPlaylistId).value
    if (!playlist) return

    const prompt = formatTrackIds(trackIds, {
        one: title => `Are you sure you want to remove "${title}" from the playlist "${playlist.title}"?`,
        many: count => `Are you sure you want to remove the ${count} selected songs from the playlist "${playlist.title}"?`,
    })

    return {
        text: 'Remove from Playlist',
        action: async () => {
            const answer = await confirm(prompt, {
                title: '',
                kind: 'warning',
                okLabel: 'Remove Songs',
                cancelLabel: 'Cancel',
            })
            if (!answer) return
            removeTracksFromPlaylist({ trackIds, playlistId: playlist.id })
        },
    }
}

function moveSelectedTracksToTrash(): MenuItem {
    const trackIds = getSelections($tracksLSM.value)
    if (!trackIds.length) return

    const prompt = formatTrackIds(trackIds, {
        one: title => `Are you sure you want to trash the song "${title}"?`,
        many: count => `Are you sure you want to trash the ${count} selected songs?`,
    })

    return {
        text: 'Move to Trash',
        action: async () => {
            const answer = await confirm(prompt, {
                title: '',
                kind: 'warning',
                okLabel: 'Move to Trash',
                cancelLabel: 'Cancel',
            })
            if (!answer) return
            trashTracks(trackIds)
        },
    }
}
