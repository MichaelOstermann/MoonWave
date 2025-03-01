import type { ReactNode } from 'react'
import { $playingTrackId } from '@app/state/playingTrackId'
import { $tracksById } from '@app/state/tracksById'
import { useSignal } from '@app/utils/signals/useSignal'

export function TrackTitle(): ReactNode {
    const title = useSignal(() => {
        const trackId = $playingTrackId()
        const track = $tracksById(trackId)()
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
