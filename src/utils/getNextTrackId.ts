import { $nextPlayedTrackIds, $playedTrackIds, $playingMode, $playingTrackId, $playingTracks } from '@app/state/state'

export function getNextTrackId(excludedTrackIds: string[]): string | undefined {
    return getNextSingleTrackId(excludedTrackIds)
        ?? getNextPlayedTrackId(excludedTrackIds)
        ?? getNextRepeatTrackId(excludedTrackIds)
        ?? getNextShuffleTrackId(excludedTrackIds)
        ?? getFallbackTrackId(excludedTrackIds)
}

function getNextSingleTrackId(excludedTrackIds: string[]): string | undefined {
    if ($playingMode.value !== 'SINGLE') return
    const trackId = $playingTrackId.value ?? $nextPlayedTrackIds.value.at(0)
    if (!trackId) return undefined
    return excludedTrackIds.includes(trackId) ? undefined : trackId
}

function getNextPlayedTrackId(excludedTrackIds: string[]): string | undefined {
    const playingTrackId = $playingTrackId.value
    for (const trackId of $nextPlayedTrackIds.value) {
        if (trackId !== playingTrackId && !excludedTrackIds.includes(trackId))
            return trackId
    }
    return undefined
}

function getNextRepeatTrackId(excludedTrackIds: string[]): string | undefined {
    if ($playingMode.value !== 'REPEAT') return
    const playingTrackId = $playingTrackId.value
    const tracks = $playingTracks.value.filter(t => !excludedTrackIds.includes(t.id))
    const offset = tracks.findIndex(t => t.id === playingTrackId)
    const nextTrack = tracks.at(offset + 1) ?? tracks.at(0)
    return nextTrack?.id
}

function getNextShuffleTrackId(excludedTrackIds: string[]): string | undefined {
    if ($playingMode.value !== 'SHUFFLE') return

    const playingTrackId = $playingTrackId.value
    const trackIds = $playingTracks.value.map(t => t.id).filter(tid => tid !== playingTrackId && !excludedTrackIds.includes(tid))
    if (!trackIds.length) return undefined

    const unplayedTrackIds = trackIds.filter(tid => !$playedTrackIds.value.includes(tid))
    if (unplayedTrackIds.length) return random(unplayedTrackIds)

    $playedTrackIds.set([])
    return random(trackIds)
}

function getFallbackTrackId(excludedTrackIds: string[]): string | undefined {
    return $playingTracks.value.find(t => !excludedTrackIds.includes(t.id))?.id
}

function random<T>(list: T[]): T | undefined {
    return list[Math.floor(Math.random() * list.length)]
}
