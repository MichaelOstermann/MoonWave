import type { ReactNode } from 'react'
import { TrackArtistAlbum } from './TrackArtistAlbum'
import { TrackTitle } from './TrackTitle'

export function TrackInfo(): ReactNode {
    return (
        <div className="absolute inset-x-12 bottom-0.5 top-0 flex flex-col items-center justify-center gap-y-0.5">
            <TrackTitle />
            <TrackArtistAlbum />
        </div>
    )
}
