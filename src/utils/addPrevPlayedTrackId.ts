import { $nextPlayedTrackIds, $prevPlayedTrackIds } from '@app/state/state'

const MAX_SIZE = 100

export function addPrevPlayedTrackId(trackId: string): void {
    const prevIds = $prevPlayedTrackIds.value
    const nextIds = $nextPlayedTrackIds.value

    if (prevIds.at(0) === trackId) {
        $prevPlayedTrackIds.set(prevIds.slice(1))
        $nextPlayedTrackIds.set(uniq([trackId, ...nextIds]))
    }
    else if (nextIds.at(0) === trackId) {
        $prevPlayedTrackIds.set(uniq([trackId, ...prevIds]))
        $nextPlayedTrackIds.set(nextIds.slice(1))
    }
    else {
        $prevPlayedTrackIds.set(uniq([trackId, ...prevIds]).slice(0, MAX_SIZE))
        $nextPlayedTrackIds.set([])
    }
}

function uniq<T>(array: T[]): T[] {
    return Array.from(new Set(array))
}
