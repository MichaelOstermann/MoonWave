import type { ReactNode } from "react"
import { Playback } from "#features/Playback"
import { Tracks } from "#features/Tracks"

export function WavesurferSeeker({ position }: { position: number }): ReactNode {
    const trackPosition = Tracks.formatDuration(Playback.$duration() * position)

    return (
        <div
            className="modal tooltip pointer-events-none absolute top-full z-20 flex h-7 -translate-x-1/2 items-center justify-center"
            style={{ left: `${position * 100}%` }}
        >
            <span className="z-10 rounded-sm px-3 text-xxs font-medium text-(--fg)">
                {trackPosition}
            </span>
            <div className="absolute z-0 flex size-full items-center justify-center overflow-hidden rounded-sm">
                <div
                    className="absolute bg-(--bg) backdrop-blur-sm"
                    style={{
                        "--tw-backdrop-blur": "blur(var(--blur))",
                        "height": "calc(100% + 50px)",
                        "width": "calc(100% + 50px)",
                    }}
                />
            </div>
        </div>
    )
}
