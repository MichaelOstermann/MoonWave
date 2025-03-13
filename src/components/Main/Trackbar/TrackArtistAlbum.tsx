import type { ReactNode } from 'react'
import { $playingTrack } from '@app/state/tracks/playingTrack'
import { useSignal } from '@monstermann/signals'

export function TrackArtistAlbum(): ReactNode {
    const content = useSignal(() => {
        const track = $playingTrack()
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
