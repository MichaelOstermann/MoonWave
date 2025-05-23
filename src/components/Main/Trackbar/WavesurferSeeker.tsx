import type { ReactNode } from 'react'
import { $currentTrackDuration } from '@app/state/audio/currentTrackDuration'
import { formatDuration } from '@app/utils/formatDuration'
import { useSignal } from '@monstermann/signals'

export function WavesurferSeeker({ position }: { position: number }): ReactNode {
    const trackPosition = useSignal(() => formatDuration($currentTrackDuration() * position))

    return (
        <div
            className="modal tooltip pointer-events-none absolute top-full z-20 flex h-8 items-center justify-center"
            style={{ left: `${position * 100}%` }}
        >
            <span className="floating absolute rounded bg-[--bg] px-2 py-1 text-xxs font-medium text-[--fg] backdrop-blur-xl">
                {trackPosition}
            </span>
        </div>
    )
}
