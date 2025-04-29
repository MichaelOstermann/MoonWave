import type { ReactNode } from "react"
import { Playback } from "#features/Playback"

export function TrackTitle(): ReactNode {
    const title = Playback.$track()?.title || ""

    return (
        <div className="flex max-w-full text-xs font-medium">
            <span className="truncate">
                {title}
            </span>
        </div>
    )
}
