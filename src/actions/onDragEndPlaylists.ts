import { $draggingPlaylistIds, $dropPlaylistId, $dropPlaylistSide, $playlists } from '@app/state/state'
import { action } from '@app/utils/signals/action'
import { match } from 'ts-pattern'

export const onDragEndPlaylists = action(() => {
    const ids = $draggingPlaylistIds()
    const targetId = $dropPlaylistId()
    const side = $dropPlaylistSide()

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

    $draggingPlaylistIds.set([])
})
