import type { ReactNode } from 'react'
import { useTransition } from '@app/hooks/useTransition'
import { $draggingPlaylistIds } from '@app/state/playlists/draggingPlaylistIds'
import { $isDraggingPlaylists } from '@app/state/playlists/isDraggingPlaylists'
import { formatPlaylistIds } from '@app/utils/playlist/formatPlaylistIds'
import { useSignal } from '@monstermann/signals'
import { createPortal } from 'react-dom'
import { Ghost } from '../Ghost'

export function PlaylistDragGhost(): ReactNode {
    const isDraggingPlaylists = useSignal($isDraggingPlaylists)
    const playlistIds = useSignal($draggingPlaylistIds)

    const transition = useTransition({
        isOpen: isDraggingPlaylists,
        openDuration: 300,
        closeDuration: 300,
    })

    if (!transition.mounted) return null

    const content = formatPlaylistIds(playlistIds, {
        one: title => title,
        many: count => `${count} tracks`,
    })

    return createPortal(
        <Ghost transition={transition} className="max-w-40">
            <span className="truncate">
                {content}
            </span>
        </Ghost>,
        document.body,
    )
}
