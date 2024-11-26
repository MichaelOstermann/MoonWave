import { $playlistsToTracks, $playlistsToTracksByPlaylistId } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const addTracksToPlaylist = action(({ trackIds, playlistId }: {
    trackIds: string[]
    playlistId: string
}) => {
    const currentTrackIds = $playlistsToTracksByPlaylistId(playlistId).value.map(pt => pt.trackId)
    const trackIdsToAdd = trackIds.filter(trackId => !currentTrackIds.includes(trackId))

    for (const trackId of trackIdsToAdd) {
        $playlistsToTracks.map(tracks => [...tracks, {
            trackId,
            playlistId,
            addedAt: new Date().toISOString(),
        }])
    }
})
