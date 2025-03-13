import type { ReactNode } from 'react'
import { $playingTrack } from '@app/state/tracks/playingTrack'
import { useSignal } from '@monstermann/signals'

export function TrackTitle(): ReactNode {
    const title = useSignal(() => {
        const track = $playingTrack()
        return track?.title || ''
    })

    return (
        <div className="flex max-w-full text-xs font-medium">
            <span className="truncate">
                {title}
            </span>
        </div>
    )
}
