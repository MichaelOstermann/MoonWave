import { $playlists } from '@app/state/playlists/playlists'
import { $playlistsById } from '@app/state/playlists/playlistsById'
import { findAllAndMap } from '@app/utils/data/findAllAndMap'
import { merge } from '@app/utils/data/merge'
import { pipe } from '@app/utils/data/pipe'
import { remove } from '@app/utils/data/remove'
import { autoAnimate } from '@app/utils/dom/autoAnimate'
import { closeEmptyPlaylists } from '@app/utils/playlist/closeEmptyPlaylists'
import { getPlaylistChildren } from '@app/utils/playlist/getPlaylistChildren'
import { action } from '@monstermann/signals'

export const deletePlaylist = action(async (playlistId: string) => {
    const playlist = $playlistsById(playlistId)()
    const children = getPlaylistChildren(playlistId)
    if (!playlist) return

    autoAnimate({
        target: document.querySelector('.sidebar .playlists'),
        filter: element => element.hasAttribute('data-playlist-id'),
    })

    $playlists.map((ps) => {
        return pipe(
            ps,
            // Remove playlist.
            ps => remove(ps, playlist),
            // Reparent children.
            ps => findAllAndMap(
                ps,
                p => children.includes(p),
                p => merge(p, { parentId: playlist.parentId }),
            ),
            // Close parent if this was the last child.
            ps => closeEmptyPlaylists(ps),
        )
    })
})
