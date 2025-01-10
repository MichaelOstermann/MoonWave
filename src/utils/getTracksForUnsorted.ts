import type { Track } from '@app/types'
import { $playlistsToTracks, $tracks, $tracksFilter } from '@app/state/state'
import { pipeInto } from 'ts-functional-pipe'
import { applyFilterToTracks } from './applyFilterToTracks'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'
import { computed } from './signals/computed'
import { sortView } from './sortTracks'

const $sortedTrackIds = computed(() => {
    return $playlistsToTracks.value.reduce((acc, ptt) => acc.add(ptt.trackId), new Set<string>())
})

export function getTracksForUnsorted(options?: { applyFilter: boolean }): Track[] {
    return pipeInto(
        $tracks.value,
        tracks => removeUnsupportedTracks(tracks),
        tracks => tracks.filter(t => !$sortedTrackIds.value.has(t.id)),
        tracks => options?.applyFilter && $tracksFilter.value
            ? applyFilterToTracks(tracks, $tracksFilter.value)
            : sortView(tracks, { name: 'UNSORTED' }),
    )
}
