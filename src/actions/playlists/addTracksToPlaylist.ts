import { Playlists } from "#features/Playlists"
import { Array, Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const addTracksToPlaylist = action(({ playlistId, trackIds }: {
    playlistId: string
    trackIds: string[]
}) => {
    Playlists.$all(Array.findMap(
        p => p.id === playlistId,
        p => Object.merge(p, {
            trackIds: Array.union(p.trackIds, trackIds),
        }),
    ))
})
