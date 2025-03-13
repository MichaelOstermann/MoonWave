import type { Track } from '@app/types'
import { $tracks } from '@app/state/tracks/tracks'
import { $tracksFilter } from '@app/state/tracks/tracksFilter'
import { $unsortedTrackIds } from '@app/state/tracks/unsortedTrackIds'
import { applyFilterToTracks } from './applyFilterToTracks'
import { pipe } from './data/pipe'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'
import { sortView } from './sortTracks'

export function getTracksForUnsorted(options?: { applyFilter: boolean }): Track[] {
    return pipe(
        $tracks(),
        tracks => removeUnsupportedTracks(tracks),
        tracks => tracks.filter(t => $unsortedTrackIds().has(t.id)),
        tracks => options?.applyFilter && $tracksFilter()
            ? applyFilterToTracks(tracks, $tracksFilter())
            : sortView(tracks, { name: 'UNSORTED' }),
    )
}
