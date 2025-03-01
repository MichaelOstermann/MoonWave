import type { Track } from '@app/types'
import { $tracks } from '@app/state/tracks'
import { $tracksFilter } from '@app/state/tracksFilter'
import { applyFilterToTracks } from './applyFilterToTracks'
import { pipe } from './data/pipe'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'
import { sortView } from './sortTracks'

export function getTracksForRecentlyAdded(options?: { applyFilter: boolean }): Track[] {
    return pipe(
        $tracks(),
        tracks => removeUnsupportedTracks(tracks),
        tracks => options?.applyFilter && $tracksFilter()
            ? applyFilterToTracks(tracks, $tracksFilter())
            : sortView(tracks, { name: 'RECENTLY_ADDED' }),
    )
}
