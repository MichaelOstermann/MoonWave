import type { ReactNode } from 'react'
import { Logo } from '@app/components/Logo'
import { $playingTrackId } from '@app/state/state'
import { twJoin } from 'tailwind-merge'
import { TrackDuration } from './TrackDuration'
import { TrackElapsedTime } from './TrackElapsedTime'
import { TrackInfo } from './TrackInfo'
import { TrackPosition } from './TrackPosition'
import { Wavesurfer } from './Wavesurfer'
import { WavesurferSeeker } from './WavesurferSeeker'

export function CurrentTrack(): ReactNode {
    const hasTrack = $playingTrackId.value != null

    return (
        <div className="group relative flex size-full max-w-[1000px] rounded-b-md bg-[--track-bg]">
            <div
                className={twJoin(
                    'absolute flex size-full items-center justify-center',
                    hasTrack && 'opacity-0',
                )}
            >
                <Logo className="size-6" />
            </div>
            <div
                className={twJoin(
                    'relative flex size-full',
                    !hasTrack && 'pointer-events-none opacity-0',
                )}
            >
                <TrackElapsedTime />
                <TrackInfo />
                <TrackDuration />
                <TrackPosition />
                <WavesurferSeeker />
                <Wavesurfer />
            </div>
        </div>
    )
}
