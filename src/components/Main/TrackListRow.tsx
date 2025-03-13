import type { MenuItem } from '@app/utils/menu'
import type { CSSProperties, ReactNode } from 'react'
import type { Column, Row } from './types'
import { syncLibrary } from '@app/actions/app/syncLibrary'
import { addTracksToPlaylist } from '@app/actions/playlists/addTracksToPlaylist'
import { removeTracksFromPlaylist } from '@app/actions/playlists/removeTracksFromPlaylist'
import { onClickTrack } from '@app/actions/tracks/onClickTrack'
import { onDoubleClickTrack } from '@app/actions/tracks/onDoubleClickTrack'
import { onDragStartTracks } from '@app/actions/tracks/onDragStartTracks'
import { trashTracks } from '@app/actions/tracks/trashTracks'
import { $playlists } from '@app/state/playlists/playlists'
import { $playlistsById } from '@app/state/playlists/playlistsById'
import { $viewingPlaylistId } from '@app/state/playlists/viewingPlaylistId'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { $tracksLSM } from '@app/state/tracks/tracksLSM'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { isFirstSelectionInGroup } from '@app/utils/lsm/utils/isFirstSelectionInGroup'
import { isLastSelectionInGroup } from '@app/utils/lsm/utils/isLastSelectionInGroup'
import { isSelected } from '@app/utils/lsm/utils/isSelected'
import { useMenu } from '@app/utils/menu'
import { formatTrackIds } from '@app/utils/track/formatTrackIds'
import { useSignal } from '@monstermann/signals'
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
                isPlaying && 'text-[--fg-accent]',
                selected && 'bg-[--bg-selected]',
                isActive && 'bg-[--bg-accent] text-[--fg-accent]',
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
    const trackIds = getSelections($tracksLSM())
    const currentPlaylistId = $viewingPlaylistId()

    const playlists = $playlists()
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
    const trackIds = getSelections($tracksLSM())
    if (!trackIds.length) return

    const currentPlaylistId = $viewingPlaylistId()
    const playlist = $playlistsById(currentPlaylistId)()

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
            requestAnimationFrame(() => {
                removeTracksFromPlaylist({ trackIds, playlistId: playlist.id })
            })
        },
    }
}

function moveSelectedTracksToTrash(): MenuItem {
    const trackIds = getSelections($tracksLSM())
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
            requestAnimationFrame(() => {
                trashTracks(trackIds)
            })
        },
    }
}
