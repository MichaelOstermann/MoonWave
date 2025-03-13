import { $playlists } from '@app/state/playlists/playlists'
import { autoAnimate } from '@app/utils/dom/autoAnimate'
import { action } from '@monstermann/signals'
import { nanoid } from 'nanoid'
import { editPlaylistTitle } from './editPlaylistTitle'

export const createPlaylist = action((belowPlaylistId: string | void) => {
    const playlist = {
        id: nanoid(10),
        title: '',
        trackIds: [],
    }

    autoAnimate({
        target: document.querySelector('.sidebar .playlists'),
        filter: element => element.hasAttribute('data-playlist-id'),
    })

    $playlists.map((ps) => {
        const offset = ps.findIndex(p => p.id === belowPlaylistId) + 1
        ps = [...ps]
        ps.splice(offset, 0, playlist)
        return ps
    })

    editPlaylistTitle(playlist.id)
})
