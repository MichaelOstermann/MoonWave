import { $currentTrackPosition, $playingMode, $playingTrackId, $prevPlayedTrackIds } from '@app/state/state'

export function getPrevTrackId(): string | undefined {
    const mode = $playingMode.value
    const playingTrackId = $playingTrackId.value

    if (mode === 'SINGLE') return playingTrackId
    if ($currentTrackPosition.value >= 5) return playingTrackId
    if ($prevPlayedTrackIds.value.length)
        return $prevPlayedTrackIds.value[0]

    return playingTrackId
}
