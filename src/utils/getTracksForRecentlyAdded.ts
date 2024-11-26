import type { Track } from '@app/types'
import { recentlyAddedOrder } from '@app/config/config'
import { $tracks, $tracksFilter } from '@app/state/state'
import { pipeInto } from 'ts-functional-pipe'
import { applyFilterToTracks } from './applyFilterToTracks'
import { applyOrderToTracks } from './applyOrderToTracks'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'

export function getTracksForRecentlyAdded(options?: { applyFilter: boolean }): Track[] {
    return pipeInto(
        $tracks.value,
        tracks => removeUnsupportedTracks(tracks),
        tracks => options?.applyFilter && $tracksFilter.value
            ? applyFilterToTracks(tracks, $tracksFilter.value)
            : applyOrderToTracks(tracks, recentlyAddedOrder),
    )
}
