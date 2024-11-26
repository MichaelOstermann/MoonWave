import { seekTo } from '@app/actions/seekTo'
import { $currentTrackDuration } from '@app/state/state'
import { formatDuration } from '@app/utils/formatDuration'
import { roundByDPR } from '@app/utils/roundByDPR'
import { useResizeObserver } from '@react-hookz/web'
import { type ReactNode, useRef, useState } from 'react'

export function WavesurferSeeker(): ReactNode {
    const [offsetX, setOffsetX] = useState(0)
    const tracklistHeaderHeight = 32

    const containerRef = useRef<HTMLDivElement | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    useResizeObserver(containerRef, (entry) => {
        setContainerWidth(entry.contentRect.width)
    })

    const labelRef = useRef<HTMLDivElement | null>(null)
    const [labelWidth, setLabelWidth] = useState(0)
    const [labelHeight, setLabelHeight] = useState(0)
    useResizeObserver(labelRef, (entry) => {
        setLabelWidth(entry.contentRect.width)
        setLabelHeight(entry.contentRect.height)
    })

    const labelY = roundByDPR((tracklistHeaderHeight - labelHeight) / 2)
    const labelX = roundByDPR(offsetX - (labelWidth / 2))
    const position = $currentTrackDuration.value * (offsetX / containerWidth)

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-20 flex cursor-crosshair opacity-0 group-hover:opacity-100"
            onMouseMove={evt => setOffsetX(Math.max(0, evt.nativeEvent.offsetX))}
            onClick={() => seekTo(position)}
        >
            <div
                className="pointer-events-none absolute inset-y-0 left-0 flex w-px"
                style={{ transform: `translateX(${offsetX}px)` }}
            />
            <div
                ref={labelRef}
                className="tooltip pointer-events-none absolute top-full flex rounded bg-[--bg] text-xxs font-semibold text-[--fg] backdrop-blur"
                style={{ transform: `translate(${labelX}px, ${labelY}px)` }}
            >
                <span className="px-2 py-1">
                    {formatDuration(position)}
                </span>
            </div>
        </div>
    )
}
