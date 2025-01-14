import type { ReactNode } from 'react'
import { $playingTrackId, $tracksById } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'

export function TrackArtistAlbum(): ReactNode {
    const content = useSignal(() => {
        const trackId = $playingTrackId.value
        const track = $tracksById(trackId).value
        if (!track) return ''
        return [track.artist, track.album]
            .filter(Boolean)
            .join(' — ')
    })

    return (
        <div className="flex max-w-full text-xs">
            <span className="truncate">
                {content}
            </span>
        </div>
    )
}
