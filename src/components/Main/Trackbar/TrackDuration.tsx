import type { ReactNode } from 'react'
import { $currentTrackDuration } from '@app/state/audio/currentTrackDuration'
import { $currentTrackPosition } from '@app/state/audio/currentTrackPosition'
import { formatDuration } from '@app/utils/formatDuration'
import { useSignal } from '@monstermann/signals'

export function TrackDuration(): ReactNode {
    const position = useSignal($currentTrackPosition)
    const duration = useSignal($currentTrackDuration)
    const leftoverTime = Math.min(Math.max(duration - position, 0), duration)
    const formattedDuration = `-${formatDuration(leftoverTime)}`

    return (
        <div className="absolute bottom-0.5 right-0 flex shrink-0 items-end justify-end px-1.5 py-1 text-xxs font-medium group-hover:opacity-0">
            {formattedDuration}
        </div>
    )
}
