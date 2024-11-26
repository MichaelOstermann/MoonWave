import type { Track } from '@app/types'
import { $playlistsToTracksByPlaylistId, $tracksById, $tracksFilter } from '@app/state/state'
import { pipeInto } from 'ts-functional-pipe'
import { applyFilterToTracks } from './applyFilterToTracks'
import { applyOrderToTracks } from './applyOrderToTracks'
import { getOrderForPlaylist } from './getOrderForPlaylist'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'

export function getTracksForPlaylist(playlistId: string, options?: { applyFilter: boolean }): Track[] {
    return pipeInto(
        $playlistsToTracksByPlaylistId(playlistId).value,
        pts => pts.flatMap((pt) => {
            const track = $tracksById(pt.trackId).value
            return track ? [{ ...track, addedAt: pt.addedAt }] : []
        }),
        tracks => removeUnsupportedTracks(tracks),
        tracks => options?.applyFilter && $tracksFilter.value
            ? applyFilterToTracks(tracks, $tracksFilter.value)
            : applyOrderToTracks(tracks, getOrderForPlaylist(playlistId)),
    )
}
