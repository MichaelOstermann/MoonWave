import { $playlistsToTracks, $playlistsToTracksByPlaylistId } from '@app/state/state'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { action } from '@app/utils/signals/action'

export const removeTracksFromPlaylist = action(({ trackIds, playlistId }: {
    trackIds: string[]
    playlistId: string
}) => {
    const currentTrackIds = $playlistsToTracksByPlaylistId(playlistId).value.map(pt => pt.trackId)
    const trackIdsToRemove = trackIds.filter(trackId => currentTrackIds.includes(trackId))

    $playlistsToTracks.map(findAndRemoveAll(
        pt => pt.playlistId === playlistId && trackIdsToRemove.includes(pt.trackId),
    ))
})
