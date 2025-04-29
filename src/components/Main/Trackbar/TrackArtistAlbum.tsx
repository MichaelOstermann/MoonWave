import type { ReactNode } from "react"
import { Playback } from "#features/Playback"
import { useSignal } from "@monstermann/signals-react"

export function TrackArtistAlbum(): ReactNode {
    const content = useSignal(() => {
        const track = Playback.$track()
        if (!track) return ""
        return [track.artist, track.album]
            .filter(Boolean)
            .join(" — ")
    })

    return (
        <div className="flex max-w-full text-xs">
            <span className="truncate">
                {content}
            </span>
        </div>
    )
}
