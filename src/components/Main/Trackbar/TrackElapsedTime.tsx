import type { ReactNode } from "react"
import { Playback } from "#features/Playback"
import { Tracks } from "#features/Tracks"

export function TrackElapsedTime(): ReactNode {
    const currentTrackPosition = Tracks.formatDuration(Playback.$position())

    return (
        <div className="absolute bottom-0.5 left-0 flex shrink-0 items-end justify-start px-1.5 py-1 text-xxs font-medium">
            {currentTrackPosition}
        </div>
    )
}
