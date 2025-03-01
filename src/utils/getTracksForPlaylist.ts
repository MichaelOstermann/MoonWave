import type { Track } from '@app/types'
import { $playlistsById } from '@app/state/playlistsById'
import { $tracksById } from '@app/state/tracksById'
import { $tracksFilter } from '@app/state/tracksFilter'
import { applyFilterToTracks } from './applyFilterToTracks'
import { pipe } from './data/pipe'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'
import { sortView } from './sortTracks'

export function getTracksForPlaylist(playlistId: string, options?: { applyFilter: boolean }): Track[] {
    return pipe(
        $playlistsById(playlistId)()?.trackIds ?? [],
        tids => tids.flatMap((tid) => {
            const track = $tracksById(tid)()
            return track ? [track] : []
        }),
        tracks => removeUnsupportedTracks(tracks),
        tracks => options?.applyFilter && $tracksFilter()
            ? applyFilterToTracks(tracks, $tracksFilter())
            : sortView(tracks, { name: 'PLAYLIST', value: playlistId }),
    )
}
