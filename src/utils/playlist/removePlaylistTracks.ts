import type { Playlist } from '@app/types'
import { findAndRemoveAll } from '../data/findAndRemoveAll'
import { merge } from '../data/merge'

export function removePlaylistTracks(playlist: Playlist, trackIds: string[]): Playlist {
    const newTrackIds = findAndRemoveAll(playlist.trackIds, trackId => trackIds.includes(trackId))
    return merge(playlist, { trackIds: newTrackIds })
}
