import { $currentTrackPosition } from '@app/state/currentTrackPosition'
import { $playingMode } from '@app/state/playingMode'
import { $playingTrackId } from '@app/state/playingTrackId'
import { $prevPlayedTrackIds } from '@app/state/prevPlayedTrackIds'

export function getPrevTrackId(): string | undefined {
    const mode = $playingMode()
    const playingTrackId = $playingTrackId()

    if (mode === 'SINGLE') return playingTrackId
    if ($currentTrackPosition() >= 5) return playingTrackId
    if ($prevPlayedTrackIds().length)
        return $prevPlayedTrackIds()[0]

    return playingTrackId
}
