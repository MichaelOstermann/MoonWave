import type { ReactNode } from 'react'
import { $playingTrackId, $tracksById } from '@app/state/state'
import { useComputed } from '@preact/signals-react'

export function TrackArtistAlbum(): ReactNode {
    const content = useComputed(() => {
        const trackId = $playingTrackId.value
        const track = $tracksById(trackId).value
        if (!track) return ''
        return [track.artist, track.album]
            .filter(Boolean)
            .join(' — ')
    }).value

    return (
        <div className="flex max-w-full text-xs">
            <span className="truncate">
                {content}
            </span>
        </div>
    )
}
