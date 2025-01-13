import { $playlists } from '@app/state/state'
import { findAndMap } from '@app/utils/data/findAndMap'
import { addPlaylistTracks } from '@app/utils/playlist/addPlaylistTracks'
import { action } from '@app/utils/signals/action'

export const addTracksToPlaylist = action(({ trackIds, playlistId }: {
    trackIds: string[]
    playlistId: string
}) => {
    $playlists.map(findAndMap(
        p => p.id === playlistId,
        p => addPlaylistTracks(p, trackIds),
    ))
})
