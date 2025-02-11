import type { ReactNode } from 'react'
import { seekTo } from '@app/actions/seekTo'
import { Logo } from '@app/components/Logo'
import { $currentTrackDuration, $playingTrackId } from '@app/state/state'
import { createSeeker } from '@app/utils/seeker'
import { useSignal } from '@app/utils/signals/useSignal'
import { TrackDuration } from './TrackDuration'
import { TrackElapsedTime } from './TrackElapsedTime'
import { TrackInfo } from './TrackInfo'
import { TrackPosition } from './TrackPosition'
import { Wavesurfer } from './Wavesurfer'
import { WavesurferSeeker } from './WavesurferSeeker'

const seeker = createSeeker<HTMLDivElement>({
    useHoverPreview: true,
    cursor: '!cursor-crosshair',
    onSeekEnd(pos) {
        seekTo($currentTrackDuration.value * pos.relX)
    },
})

export function CurrentTrack(): ReactNode {
    const hasTrack = useSignal(() => $playingTrackId.value != null)
    const iSeeking = useSignal(seeker.$seeking)
    const position = useSignal(seeker.$relX)

    return (
        <div
            ref={el => void seeker.$element.set(el)}
            data-show-logo={!hasTrack}
            data-show-track={hasTrack && !iSeeking}
            data-show-waveform={hasTrack && iSeeking}
            className="group relative flex size-full max-w-[1000px] rounded-b-md bg-[--bg-soft]"
        >
            <div className='absolute inset-0 flex items-center justify-center group-data-[show-logo="false"]:opacity-0'>
                <Logo className="size-6" />
            </div>
            <div className='absolute inset-0 flex size-full group-data-[show-track="false"]:opacity-0'>
                <TrackElapsedTime />
                <TrackInfo />
                <TrackDuration />
                <TrackPosition />
            </div>
            <div className='absolute inset-0 flex size-full group-data-[show-waveform="true"]:cursor-crosshair group-data-[show-waveform="false"]:opacity-0'>
                <WavesurferSeeker position={position} />
                <Wavesurfer />
            </div>
        </div>
    )
}
