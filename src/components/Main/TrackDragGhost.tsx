import { onDragEndTracks } from '@app/actions/onDragEndTracks'
import { $isDraggingTracks, $tracksById, $tracksLSM } from '@app/state/state'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { roundByDPR } from '@app/utils/roundByDPR'
import { useEventListener } from '@react-hookz/web'
import { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { twJoin } from 'tailwind-merge'

export function TrackDragGhost(): ReactNode {
    const [el, setEl] = useState<HTMLDivElement | null>(null)
    const [width, setWidth] = useState(Number.NaN)
    const [height, setHeight] = useState(Number.NaN)
    const [x, setX] = useState(Number.NaN)
    const [y, setY] = useState(Number.NaN)

    useEventListener(document, 'mousemove', (evt: MouseEvent) => {
        if (!$isDraggingTracks.value) return
        setX(evt.clientX)
        setY(evt.clientY)
    })

    useEventListener(document, 'mouseup', () => {
        if (!$isDraggingTracks.value) return
        onDragEndTracks()
    })

    useEffect(() => {
        if (!el) {
            setWidth(Number.NaN)
            setHeight(Number.NaN)
            setX(Number.NaN)
            setY(Number.NaN)
            return
        }
        const { width, height } = el.getBoundingClientRect()
        setWidth(width)
        setHeight(height)
    }, [el])

    if (!$isDraggingTracks.value) return null

    const draggingTrackIds = getSelections($tracksLSM.value)
    const isDraggingSingle = draggingTrackIds.length === 1
    const content = isDraggingSingle
        ? $tracksById(draggingTrackIds[0]).value!.title
        : `${draggingTrackIds.length} tracks`

    const hasMeasurements = Number.isFinite(width)
        && Number.isFinite(height)
        && Number.isFinite(x)
        && Number.isFinite(y)

    return createPortal(
        <div
            ref={setEl}
            className="tooltip pointer-events-none absolute left-0 top-0 flex max-w-32 rounded bg-[--bg] px-2 py-1 text-xs font-semibold text-[--fg] backdrop-blur"
            style={{
                transform: `translate(${roundByDPR(x - (width / 2))}px, ${roundByDPR(y - (height / 1.5))}px)`,
                opacity: hasMeasurements ? 1 : 0,
            }}
        >
            <span className={twJoin(isDraggingSingle && 'truncate')}>
                {content}
            </span>
        </div>,
        document.body,
    )
}
