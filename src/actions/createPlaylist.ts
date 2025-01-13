import { $playlists } from '@app/state/state'
import { createPlaylist as create } from '@app/utils/playlist/createPlaylist'
import { action } from '@app/utils/signals/action'
import { editPlaylistTitle } from './editPlaylistTitle'

export const createPlaylist = action(() => {
    const playlist = create()
    $playlists.map(ps => [...ps, playlist])
    editPlaylistTitle(playlist.id)
})
