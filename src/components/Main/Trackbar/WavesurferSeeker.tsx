import type { ReactNode } from 'react'
import { $currentTrackDuration } from '@app/state/state'
import { formatDuration } from '@app/utils/formatDuration'
import { useSignal } from '@app/utils/signals/useSignal'

export function WavesurferSeeker({ position }: { position: number }): ReactNode {
    const trackPosition = useSignal(() => formatDuration($currentTrackDuration.value * position))

    return (
        <div
            className="tooltip pointer-events-none absolute top-full z-20 flex h-8 items-center justify-center"
            style={{ left: `${position * 100}%` }}
        >
            <span className="absolute rounded bg-[--bg] px-2 py-1 text-xxs font-semibold text-[--fg] backdrop-blur">
                {trackPosition}
            </span>
        </div>
    )
}
