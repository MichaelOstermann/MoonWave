import type { Track } from '@app/types'
import { $tracks, $tracksFilter, $unsortedTrackIds } from '@app/state/state'
import { pipeInto } from 'ts-functional-pipe'
import { applyFilterToTracks } from './applyFilterToTracks'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'
import { sortView } from './sortTracks'

export function getTracksForUnsorted(options?: { applyFilter: boolean }): Track[] {
    return pipeInto(
        $tracks.value,
        tracks => removeUnsupportedTracks(tracks),
        tracks => tracks.filter(t => $unsortedTrackIds().has(t.id)),
        tracks => options?.applyFilter && $tracksFilter.value
            ? applyFilterToTracks(tracks, $tracksFilter.value)
            : sortView(tracks, { name: 'UNSORTED' }),
    )
}
