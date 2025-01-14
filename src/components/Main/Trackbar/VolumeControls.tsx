import type { ReactNode } from 'react'
import { setVolume } from '@app/actions/setVolume'
import { toggleMute } from '@app/actions/toggleMute'
import { Button } from '@app/components/Button'
import { $muted, $volume } from '@app/state/state'
import { LucideVolume1, LucideVolume2, LucideVolumeOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { pipeInto } from 'ts-functional-pipe'
import { match } from 'ts-pattern'

const barHeight = 8
const barWidth = 64
const knobSize = 14

export function VolumeControls(): ReactNode {
    const ref = useRef<HTMLDivElement>(null)
    const [barLeft, setBarLeft] = useState(0)
    const [mouseX, setMouseX] = useState(0)
    const [isSeeking, setIsSeeking] = useState(false)

    const volume = $muted.value ? 0 : $volume.value

    const Icon = match(volume)
        .with(1, () => LucideVolume2)
        .with(0, () => LucideVolumeOff)
        .otherwise(() => LucideVolume1)

    useEffect(() => {
        if (!isSeeking) return
        const onMouseUp = () => setIsSeeking(false)
        const onMouseMove = (evt: globalThis.MouseEvent) => setMouseX(evt.clientX)
        document.addEventListener('mouseup', onMouseUp)
        document.addEventListener('mousemove', onMouseMove, { passive: true })
        return () => {
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('mousemove', onMouseMove)
        }
    }, [isSeeking])

    useEffect(() => {
        if (!isSeeking) return
        const volume = pipeInto(
            (mouseX - barLeft) / barWidth,
            v => Math.max(0, v),
            v => Math.min(1, v),
            v => v.toFixed(2),
            v => Number.parseFloat(v),
        )
        if ($volume.value === volume) return
        setVolume(volume)
    }, [isSeeking, mouseX, barLeft])

    return (
        <div className="flex items-center">
            <Button onClick={toggleMute}>
                <Icon className="size-3.5" />
            </Button>
            <div
                data-seeking={isSeeking}
                className="group flex h-full items-center px-2"
                onContextMenu={evt => evt.preventDefault()}
                onMouseDown={(evt) => {
                    const bounds = ref.current?.getBoundingClientRect()
                    if (!bounds) return
                    setBarLeft(bounds.left)
                    setMouseX(evt.clientX)
                    setIsSeeking(true)
                }}
            >
                <div
                    ref={ref}
                    className="relative flex h-[--bar-height] items-center justify-end rounded-full bg-[--volume-bar-bg]"
                    style={{
                        'width': barWidth,
                        '--bar-height': `${barHeight}px`,
                        '--knob-size': `${knobSize}px`,
                        '--knob-position': `${volume * barWidth}px`,
                    }}
                >
                    <div className="absolute left-0 flex translate-x-[--knob-position] items-center justify-center rounded-full">
                        <div className="absolute size-[--bar-height] rounded-full bg-[--volume-knob-bg] transition-all group-hover:size-[--knob-size] group-data-[seeking=true]:size-[--knob-size]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
