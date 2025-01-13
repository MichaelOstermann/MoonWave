import type { Playlist } from '@app/types'

export function hasPlaylistTrack(playlist: Playlist, trackId: string): boolean {
    return playlist.trackIds.includes(trackId)
}
