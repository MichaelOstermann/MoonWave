import type { ReactNode } from 'react'
import { setVolume } from '@app/actions/audio/setVolume'
import { toggleMute } from '@app/actions/audio/toggleMute'
import { Button } from '@app/components/Button'
import { $isMuted } from '@app/state/audio/isMuted'
import { $volume } from '@app/state/audio/volume'
import { createSeeker } from '@app/utils/seeker'
import { useSignal } from '@monstermann/signals'
import { LucideVolume1, LucideVolume2, LucideVolumeOff } from 'lucide-react'
import { match } from 'ts-pattern'

const barHeight = 8
const barWidth = 64
const knobSize = 14

const seeker = createSeeker({
    cursor: 'cursor-default',
    onSeekStart: pos => setVolume(pos.relX),
    onSeek: pos => setVolume(pos.relX),
})

export function VolumeControls(): ReactNode {
    const volume = useSignal(() => $isMuted() ? 0 : $volume())
    const isSeeking = useSignal(seeker.$seeking)

    const Icon = match(volume)
        .with(1, () => LucideVolume2)
        .with(0, () => LucideVolumeOff)
        .otherwise(() => LucideVolume1)

    return (
        <div className="flex items-center">
            <Button
                onClick={toggleMute}
                className="size-7"
            >
                <Icon className="size-3.5" />
            </Button>
            <div
                className="group flex h-full items-center px-2"
                onContextMenu={evt => evt.preventDefault()}
            >
                <div
                    ref={seeker.$element.set}
                    data-seeking={isSeeking}
                    className="group relative flex h-[--bar-height] items-center justify-end rounded-full bg-[--bg-hover]"
                    style={{
                        'width': barWidth,
                        '--bar-height': `${barHeight}px`,
                        '--knob-size': `${knobSize}px`,
                        '--knob-position': `${volume * barWidth}px`,
                    }}
                >
                    <div className="absolute left-0 flex translate-x-[--knob-position] items-center justify-center rounded-full">
                        <div className="absolute size-[--bar-height] rounded-full bg-[--fg] transition-all group-hover:size-[--knob-size] group-data-[seeking='true']:size-[--knob-size]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
