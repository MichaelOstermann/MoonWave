import { $playlists } from '@app/state/playlists'
import { findAndMap } from '@app/utils/data/findAndMap'
import { removePlaylistTracks } from '@app/utils/playlist/removePlaylistTracks'
import { action } from '@app/utils/signals/action'

export const removeTracksFromPlaylist = action(({ trackIds, playlistId }: {
    trackIds: string[]
    playlistId: string
}) => {
    return $playlists.map(findAndMap(
        p => p.id === playlistId,
        p => removePlaylistTracks(p, trackIds),
    ))
})
