import type { ReactNode } from "react"
import { Playback } from "#features/Playback"

export function TrackPosition(): ReactNode {
    const width = 100 * (Playback.$position() / Playback.$duration())

    return (
        <div className="absolute inset-0 flex items-end overflow-hidden rounded-b-md">
            <div className="relative flex h-0.5 w-full">
                <div
                    className="absolute inset-y-0 left-0 bg-(--accent)"
                    style={{ width: `${Number.isFinite(width) ? width : 0}%` }}
                />
            </div>
        </div>
    )
}
