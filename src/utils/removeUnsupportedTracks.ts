import type { Track } from '@app/types'
import { audio } from '@app/state/audio'

export function removeUnsupportedTracks(tracks: Track[]): Track[] {
    return tracks.filter(track => audio.canPlayType(track.mimetype))
}
