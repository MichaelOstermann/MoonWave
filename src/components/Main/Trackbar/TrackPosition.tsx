import type { ReactNode } from 'react'
import { $currentTrackDuration, $currentTrackPosition } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'

export function TrackPosition(): ReactNode {
    const width = useSignal(() => 100 * ($currentTrackPosition.value / $currentTrackDuration.value))

    return (
        <div className="absolute inset-0 flex items-end overflow-hidden rounded-b-md">
            <div className="relative flex h-0.5 w-full group-hover:opacity-0">
                <div
                    className="absolute inset-y-0 left-0 bg-[--accent]"
                    style={{ width: `${Number.isFinite(width) ? width : 0}%` }}
                />
            </div>
        </div>
    )
}
