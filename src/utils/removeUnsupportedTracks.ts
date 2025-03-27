import type { Track } from '@app/types'
import { audio } from '@app/state/audio/audio'

const cache = new Map<string, boolean>()

export function removeUnsupportedTracks(tracks: Track[]): Track[] {
    return tracks.filter((track) => {
        if (cache.has(track.mimetype)) return cache.get(track.mimetype)
        const result = !!audio.canPlayType(track.mimetype)
        cache.set(track.mimetype, result)
        return result
    })
}
