import type { ReactNode } from "react"
import { setVolume } from "#actions/audio/setVolume"
import { toggleMute } from "#actions/audio/toggleMute"
import { Button } from "#components/Button"
import { Playback } from "#features/Playback"
import { createSeeker } from "#utils/seeker"
import { match } from "@monstermann/fn"
import { LucideVolume1, LucideVolume2, LucideVolumeOff } from "lucide-react"
import { createElement } from "react"

const barHeight = 8
const barWidth = 64
const knobSize = 14

const seeker = createSeeker({
    cursor: "cursor-default",
    onSeek: pos => setVolume(pos.relX),
    onSeekStart: pos => setVolume(pos.relX),
})

export function VolumeControls(): ReactNode {
    const volume = Playback.$volume()
    const isHovering = seeker.$hovering()
    const isDragging = seeker.$dragging()
    const isSeeking = isHovering || isDragging

    const icon = match(volume)
        .case(1, LucideVolume2)
        .case(0, LucideVolumeOff)
        .or(LucideVolume1)

    return (
        <div className="flex items-center">
            <Button
                className="size-7"
                onClick={toggleMute}
            >
                {createElement(icon, { className: "size-3.5" })}
            </Button>
            <div
                className="group flex h-full items-center px-2"
                onContextMenu={evt => evt.preventDefault()}
            >
                <div
                    className="group relative flex h-(--bar-height) items-center justify-end rounded-full bg-(--bg-hover)"
                    data-seeking={isSeeking}
                    ref={el => seeker.$element(el)}
                    style={{
                        "--bar-height": `${barHeight}px`,
                        "--knob-position": `${volume * barWidth}px`,
                        "--knob-size": `${knobSize}px`,
                        "width": barWidth,
                    }}
                >
                    <div className="absolute left-0 flex translate-x-(--knob-position) items-center justify-center rounded-full">
                        <div className="absolute size-(--bar-height) rounded-full bg-(--fg) transition-all group-hover:size-(--knob-size) group-data-[seeking='true']:size-(--knob-size)" />
                    </div>
                </div>
            </div>
        </div>
    )
}
