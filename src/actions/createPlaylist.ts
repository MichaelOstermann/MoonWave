import type { Playlist } from '@app/types'
import { $playlists } from '@app/state/state'
import { action } from '@app/utils/signals/action'
import { nanoid } from 'nanoid'
import { editPlaylistTitle } from './editPlaylistTitle'

export const createPlaylist = action(() => {
    const newPlaylist: Playlist = {
        id: nanoid(10),
        title: '',
        addedAt: new Date().toISOString(),
    }

    $playlists.map(ps => [...ps, newPlaylist])
    editPlaylistTitle(newPlaylist.id)
})
