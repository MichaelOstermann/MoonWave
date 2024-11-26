import type { ReactNode } from 'react'
import { $playingTrackId, $tracksById } from '@app/state/state'
import { useComputed } from '@preact/signals-react'

export function TrackTitle(): ReactNode {
    const title = useComputed(() => {
        const trackId = $playingTrackId.value
        const track = $tracksById(trackId).value
        return track?.title || ''
    }).value

    return (
        <div className="flex max-w-full text-xs font-medium">
            <span className="truncate">
                {title}
            </span>
        </div>
    )
}
