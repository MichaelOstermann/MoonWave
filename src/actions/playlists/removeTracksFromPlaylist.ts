import { Playlists } from "#features/Playlists"
import { Array, Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const removeTracksFromPlaylist = action(({ playlistId, trackIds }: {
    playlistId: string
    trackIds: string[]
}) => {
    return Playlists.$all(Array.findMap(
        p => p.id === playlistId,
        p => Object.merge(p, {
            trackIds: Array.removeAll(p.trackIds, trackIds),
        }),
    ))
})
