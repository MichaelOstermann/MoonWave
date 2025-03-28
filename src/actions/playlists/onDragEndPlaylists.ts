import { $draggingPlaylistIds } from '@app/state/playlists/draggingPlaylistIds'
import { $dropPlaylistId } from '@app/state/playlists/dropPlaylistId'
import { $dropPlaylistSide } from '@app/state/playlists/dropPlaylistSide'
import { $playlists } from '@app/state/playlists/playlists'
import { autoAnimate } from '@app/utils/dom/autoAnimate'
import { action } from '@monstermann/signals'
import { match } from 'ts-pattern'

export const onDragEndPlaylists = action(async () => {
    const ids = $draggingPlaylistIds()
    const targetId = $dropPlaylistId()
    const side = $dropPlaylistSide()

    autoAnimate({
        target: document.querySelector('.sidebar .playlists'),
        filter: element => element.hasAttribute('data-playlist-id'),
        movedElementsHint: ids.map(id => document.querySelector(`[data-playlist-id="${id}"]`)!),
    })

    $draggingPlaylistIds.set([])

    $playlists.map((playlists) => {
        const playlistsToMove = playlists.filter(p => ids.includes(p.id))
        const rest = playlists.filter(p => !ids.includes(p.id))
        const offset = rest.findIndex(p => p.id === targetId)
        if (offset < 0) return playlists
        match(side)
            .with('above', () => rest.splice(offset, 0, ...playlistsToMove))
            .with('below', () => rest.splice(offset + 1, 0, ...playlistsToMove))
            .exhaustive()
        return rest
    })
})
