import type { ReactNode } from 'react'
import { $currentTrackPosition } from '@app/state/state'
import { formatDuration } from '@app/utils/formatDuration'

export function TrackElapsedTime(): ReactNode {
    return (
        <div className="absolute bottom-0.5 left-0 flex shrink-0 items-end justify-start px-1.5 py-1 text-xxs font-medium group-hover:opacity-0">
            {formatDuration($currentTrackPosition.value)}
        </div>
    )
}
