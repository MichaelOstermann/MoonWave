import type { Playlist } from '@app/types'
import { merge } from '../data/merge'
import { hasPlaylistTrack } from './hasPlaylistTrack'

export function addPlaylistTracks(playlist: Playlist, trackIds: string[]): Playlist {
    const newTrackIds = trackIds
        .filter(trackId => !hasPlaylistTrack(playlist, trackId))

    if (!newTrackIds.length) return playlist

    return merge(playlist, {
        trackIds: playlist.trackIds.concat(newTrackIds),
    })
}
