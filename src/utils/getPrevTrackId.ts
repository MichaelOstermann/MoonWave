import { $currentTrackPosition } from '@app/state/audio/currentTrackPosition'
import { $playingMode } from '@app/state/audio/playingMode'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { $prevPlayedTrackIds } from '@app/state/tracks/prevPlayedTrackIds'

export function getPrevTrackId(): string | undefined {
    const mode = $playingMode()
    const playingTrackId = $playingTrackId()

    if (mode === 'SINGLE') return playingTrackId
    if ($currentTrackPosition() >= 5) return playingTrackId
    if ($prevPlayedTrackIds().length)
        return $prevPlayedTrackIds().at(-1)

    return playingTrackId
}
