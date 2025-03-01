import type { ReactNode } from 'react'
import { useTransition } from '@app/hooks/useTransition'
import { $isDraggingTracks } from '@app/state/isDraggingTracks'
import { $tracksLSM } from '@app/state/tracksLSM'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { useSignal } from '@app/utils/signals/useSignal'
import { formatTrackIds } from '@app/utils/track/formatTrackIds'
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
