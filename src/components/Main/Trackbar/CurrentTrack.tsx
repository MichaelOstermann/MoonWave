import type { ReactNode } from "react"
import { seekTo } from "#actions/audio/seekTo"
import { Logo } from "#components/Logo"
import { Playback } from "#features/Playback"
import { createSeeker } from "#utils/seeker"
import { TrackDuration } from "./TrackDuration"
import { TrackElapsedTime } from "./TrackElapsedTime"
import { TrackInfo } from "./TrackInfo"
import { TrackPosition } from "./TrackPosition"
import { Wavesurfer } from "./Wavesurfer"
import { WavesurferSeeker } from "./WavesurferSeeker"

const seeker = createSeeker<HTMLDivElement>({
    cursor: "cursor-crosshair!",
    useHoverPreview: true,
    onSeekEnd(pos) {
        seekTo(Playback.$duration() * pos.relX)
    },
})

export function CurrentTrack(): ReactNode {
    const hasTrack = Playback.$hasTrack()
    const position = seeker.$relX()
    const isHovering = seeker.$hovering()
    const isDragging = seeker.$dragging()
    const isSeeking = isHovering || isDragging

    return (
        <div
            className="group relative flex size-full max-w-[1000px] rounded-b-md bg-(--bg-soft)"
            data-show-logo={!hasTrack}
            data-show-track={hasTrack && !isSeeking}
            data-show-waveform={hasTrack && isSeeking}
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
                className="absolute inset-0 top-[3px] flex size-full group-data-[show-waveform=true]:cursor-crosshair group-data-[show-waveform=false]:opacity-0"
                ref={el => seeker.$element(el)}
            >
                <WavesurferSeeker position={position} />
                <Wavesurfer />
            </div>
        </div>
    )
}
