import type { Track } from '@app/types'
import { $tracksById } from '@app/state/tracks/tracksById'
import { $tracksFilter } from '@app/state/tracks/tracksFilter'
import { applyFilterToTracks } from './applyFilterToTracks'
import { pipe } from './data/pipe'
import { uniq } from './data/uniq'
import { collectPlaylists } from './playlist/collectPlaylists'
import { removeUnsupportedTracks } from './removeUnsupportedTracks'
import { sortView } from './sortTracks'

export function getTracksForPlaylist(playlistId: string, options?: { applyFilter: boolean }): Track[] {
    return pipe(
        playlistId,
        pid => collectPlaylists(pid),
        ps => ps.flatMap(p => p.trackIds),
        tids => uniq(tids),
        tids => tids.map(tid => $tracksById(tid)()),
        tracks => tracks.filter(t => !!t),
        tracks => removeUnsupportedTracks(tracks),
        tracks => options?.applyFilter && $tracksFilter()
            ? applyFilterToTracks(tracks, $tracksFilter())
            : sortView(tracks, { name: 'PLAYLIST', value: playlistId }),
    )
}
