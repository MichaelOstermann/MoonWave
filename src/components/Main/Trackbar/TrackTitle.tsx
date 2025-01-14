import type { ReactNode } from 'react'
import { $playingTrackId, $tracksById } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'

export function TrackTitle(): ReactNode {
    const title = useSignal(() => {
        const trackId = $playingTrackId.value
        const track = $tracksById(trackId).value
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
