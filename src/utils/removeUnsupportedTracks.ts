import type { Track } from '@app/types'
import { audio } from '@app/state/state'

export function removeUnsupportedTracks(tracks: Track[]): Track[] {
    return tracks.filter(track => audio.canPlayType(track.mimetype))
}
