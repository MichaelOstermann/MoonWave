import { $playlists } from '@app/state/playlists/playlists'
import { findAndRemove } from '@app/utils/data/findAndRemove'
import { autoAnimate } from '@app/utils/dom/autoAnimate'
import { action } from '@monstermann/signals'

export const deletePlaylist = action(async (playlistId: string) => {
    autoAnimate({
        target: document.querySelector('.sidebar .playlists'),
        filter: element => element.hasAttribute('data-playlist-id'),
    })

    $playlists.map(findAndRemove(p => p.id === playlistId))
})
