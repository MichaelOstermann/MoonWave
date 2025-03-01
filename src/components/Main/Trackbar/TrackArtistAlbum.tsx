import type { ReactNode } from 'react'
import { $playingTrackId } from '@app/state/playingTrackId'
import { $tracksById } from '@app/state/tracksById'
import { useSignal } from '@app/utils/signals/useSignal'

export function TrackArtistAlbum(): ReactNode {
    const content = useSignal(() => {
        const trackId = $playingTrackId()
        const track = $tracksById(trackId)()
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
