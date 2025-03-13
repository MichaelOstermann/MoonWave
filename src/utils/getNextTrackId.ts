import { $playingMode } from '@app/state/audio/playingMode'
import { $nextPlayedTrackIds } from '@app/state/tracks/nextPlayedTrackIds'
import { $playedTrackIds } from '@app/state/tracks/playedTrackIds'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { $playingTracks } from '@app/state/tracks/playingTracks'

export function getNextTrackId(excludedTrackIds: string[]): string | undefined {
    return getNextSingleTrackId(excludedTrackIds)
        ?? getNextPlayedTrackId(excludedTrackIds)
        ?? getNextRepeatTrackId(excludedTrackIds)
        ?? getNextShuffleTrackId(excludedTrackIds)
        ?? getFallbackTrackId(excludedTrackIds)
}

function getNextSingleTrackId(excludedTrackIds: string[]): string | undefined {
    if ($playingMode() !== 'SINGLE') return
    const trackId = $playingTrackId() ?? $nextPlayedTrackIds().at(0)
    if (!trackId) return undefined
    return excludedTrackIds.includes(trackId) ? undefined : trackId
}

function getNextPlayedTrackId(excludedTrackIds: string[]): string | undefined {
    const playingTrackId = $playingTrackId()
    for (const trackId of $nextPlayedTrackIds()) {
        if (trackId !== playingTrackId && !excludedTrackIds.includes(trackId))
            return trackId
    }
    return undefined
}

function getNextRepeatTrackId(excludedTrackIds: string[]): string | undefined {
    if ($playingMode() !== 'REPEAT') return
    const playingTrackId = $playingTrackId()
    const tracks = $playingTracks().filter(t => !excludedTrackIds.includes(t.id))
    const offset = tracks.findIndex(t => t.id === playingTrackId)
    const nextTrack = tracks.at(offset + 1) ?? tracks.at(0)
    return nextTrack?.id
}

function getNextShuffleTrackId(excludedTrackIds: string[]): string | undefined {
    if ($playingMode() !== 'SHUFFLE') return

    const playingTrackId = $playingTrackId()
    const trackIds = $playingTracks().map(t => t.id).filter(tid => tid !== playingTrackId && !excludedTrackIds.includes(tid))
    if (!trackIds.length) return undefined

    const unplayedTrackIds = trackIds.filter(tid => !$playedTrackIds().includes(tid))
    if (unplayedTrackIds.length) return random(unplayedTrackIds)

    $playedTrackIds.set([])
    return random(trackIds)
}

function getFallbackTrackId(excludedTrackIds: string[]): string | undefined {
    return $playingTracks().find(t => !excludedTrackIds.includes(t.id))?.id
}

function random<T>(list: T[]): T | undefined {
    return list[Math.floor(Math.random() * list.length)]
}
