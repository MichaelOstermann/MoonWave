import type { ReactNode } from 'react'
import { $currentTrackPosition } from '@app/state/state'
import { formatDuration } from '@app/utils/formatDuration'
import { useSignal } from '@app/utils/signals/useSignal'

export function TrackElapsedTime(): ReactNode {
    const currentTrackPosition = useSignal(() => formatDuration($currentTrackPosition.value))

    return (
        <div className="absolute bottom-0.5 left-0 flex shrink-0 items-end justify-start px-1.5 py-1 text-xxs font-medium">
            {currentTrackPosition}
        </div>
    )
}
