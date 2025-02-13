import { $playlists } from '@app/state/state'
import { createPlaylist as create } from '@app/utils/playlist/createPlaylist'
import { action } from '@app/utils/signals/action'
import { editPlaylistTitle } from './editPlaylistTitle'

export const createPlaylist = action((belowPlaylistId?: string) => {
    const playlist = create()

    $playlists.map((ps) => {
        const offset = ps.findIndex(p => p.id === belowPlaylistId) + 1
        ps = [...ps]
        ps.splice(offset, 0, playlist)
        return ps
    })

    editPlaylistTitle(playlist.id)
})
