import type { ReactNode } from 'react'
import { $isDraggingTracks, $mouseX, $mouseY, $tracksById, $tracksLSM } from '@app/state/state'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { useSignal } from '@app/utils/signals/useSignal'
import { createPortal } from 'react-dom'

export function TrackDragGhost(): ReactNode {
    const isDraggingTracks = useSignal($isDraggingTracks)
    if (!isDraggingTracks) return null

    return createPortal(
        <Ghost />,
        document.body,
    )
}

function Ghost(): ReactNode {
    const x = useSignal($mouseX)
    const y = useSignal($mouseY)

    const draggingTracksCount = useSignal(() => getSelections($tracksLSM.value).length)
    const firstDraggingTrackId = useSignal(() => getSelections($tracksLSM.value)[0])
    const firstDraggingTrackTitle = useSignal(() => $tracksById(firstDraggingTrackId).value?.title ?? '')
    const truncate = draggingTracksCount === 1

    const content = draggingTracksCount === 1
        ? firstDraggingTrackTitle
        : `${draggingTracksCount} tracks`

    return (
        <div
            data-truncate={truncate}
            className="tooltip group pointer-events-none absolute left-0 top-0 flex items-center justify-center"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <div className="absolute flex -translate-y-1 rounded bg-[--bg] px-2 py-1 text-xs font-semibold text-[--fg] backdrop-blur group-data-[truncate='true']:max-w-40">
                <span className="group-data-[truncate='true']:truncate">
                    {content}
                </span>
            </div>
        </div>
    )
}
