import type { Track } from '@app/types'
import { $tracks, $tracksFilter } from '@app/state/state'
import { applyFilterToTracks } from './applyFilterToTracks'
import { pipe } from './data/pipe'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'
import { sortView } from './sortTracks'

export function getTracksForRecentlyAdded(options?: { applyFilter: boolean }): Track[] {
    return pipe(
        $tracks.value,
        tracks => removeUnsupportedTracks(tracks),
        tracks => options?.applyFilter && $tracksFilter.value
            ? applyFilterToTracks(tracks, $tracksFilter.value)
            : sortView(tracks, { name: 'RECENTLY_ADDED' }),
    )
}
