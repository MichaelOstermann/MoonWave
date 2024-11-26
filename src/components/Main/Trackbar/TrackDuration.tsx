import type { ReactNode } from 'react'
import { $currentTrackDuration, $currentTrackPosition } from '@app/state/state'
import { formatDuration } from '@app/utils/formatDuration'

export function TrackDuration(): ReactNode {
    const position = $currentTrackPosition.value
    const duration = $currentTrackDuration.value
    const leftoverTime = Math.min(Math.max(duration - position, 0), duration)
    const formattedDuration = `-${formatDuration(leftoverTime)}`

    return (
        <div className="absolute bottom-0.5 right-0 flex shrink-0 items-end justify-end px-1.5 py-1 text-xxs font-medium group-hover:opacity-0">
            {formattedDuration}
        </div>
    )
}
