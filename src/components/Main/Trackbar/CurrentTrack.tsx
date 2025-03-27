import type { ReactNode } from 'react'
import { seekTo } from '@app/actions/audio/seekTo'
import { Logo } from '@app/components/Logo'
import { $currentTrackDuration } from '@app/state/audio/currentTrackDuration'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { createSeeker } from '@app/utils/seeker'
import { useSignal } from '@monstermann/signals'
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
        seekTo($currentTrackDuration() * pos.relX)
    },
})

export function CurrentTrack(): ReactNode {
    const hasTrack = useSignal(() => $playingTrackId() != null)
    const iSeeking = useSignal(seeker.$seeking)
    const position = useSignal(seeker.$relX)

    return (
        <div
            data-show-logo={!hasTrack}
            data-show-track={hasTrack && !iSeeking}
            data-show-waveform={hasTrack && iSeeking}
            className="group relative flex size-full max-w-[1000px] rounded-b-md bg-[--bg-soft]"
        >
            <div className="absolute inset-0 flex items-center justify-center group-data-[show-logo=false]:opacity-0">
                <Logo className="size-6" />
            </div>
            <div className="absolute inset-0 flex size-full group-data-[show-track=false]:opacity-0">
                <TrackElapsedTime />
                <TrackInfo />
                <TrackDuration />
                <TrackPosition />
            </div>
            <div
                ref={seeker.$element.set}
                className="absolute inset-0 top-[3px] flex size-full group-data-[show-waveform=true]:cursor-crosshair group-data-[show-waveform=false]:opacity-0"
            >
                <WavesurferSeeker position={position} />
                <Wavesurfer />
            </div>
        </div>
    )
}
