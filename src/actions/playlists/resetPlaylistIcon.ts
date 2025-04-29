import { Playlists } from "#features/Playlists"
import { Array, Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const resetPlaylistIcon = action((playlistId: string) => {
    Playlists.$all(Array.findMap(
        p => p.id === playlistId,
        Object.merge({ color: undefined, icon: undefined }),
    ))
})
