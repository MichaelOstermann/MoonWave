import type { Track } from '@app/types'
import { $playlistsById, $tracksById, $tracksFilter } from '@app/state/state'
import { pipeInto } from 'ts-functional-pipe'
import { applyFilterToTracks } from './applyFilterToTracks'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'
import { sortView } from './sortTracks'

export function getTracksForPlaylist(playlistId: string, options?: { applyFilter: boolean }): Track[] {
    return pipeInto(
        $playlistsById(playlistId).value?.trackIds ?? [],
        tids => tids.flatMap((tid) => {
            const track = $tracksById(tid).value
            return track ? [track] : []
        }),
        tracks => removeUnsupportedTracks(tracks),
        tracks => options?.applyFilter && $tracksFilter.value
            ? applyFilterToTracks(tracks, $tracksFilter.value)
            : sortView(tracks, { name: 'PLAYLIST', value: playlistId }),
    )
}
