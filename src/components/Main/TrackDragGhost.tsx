import type { ReactNode } from 'react'
import { useTransition } from '@app/hooks/useTransition'
import { $isDraggingTracks } from '@app/state/tracks/isDraggingTracks'
import { $tracksLSM } from '@app/state/tracks/tracksLSM'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { formatTrackIds } from '@app/utils/track/formatTrackIds'
import { useSignal } from '@monstermann/signals'
import { createPortal } from 'react-dom'
import { Ghost } from '../Ghost'

export function TrackDragGhost(): ReactNode {
    const isDragging = useSignal($isDraggingTracks)
    const trackIds = useSignal(() => getSelections($tracksLSM()))

    const transition = useTransition({
        isOpen: isDragging,
        openDuration: 300,
        closeDuration: 300,
    })

    if (!transition.mounted) return null

    const content = formatTrackIds(trackIds, {
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
