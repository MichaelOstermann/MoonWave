import type { PlaylistColor } from "#features/Playlists"
import { Playlists } from "#features/Playlists"
import { Array, Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const setPlaylistColor = action(({ color, playlistId }: {
    color: PlaylistColor | undefined
    playlistId: string
}) => {
    Playlists.$all(Array.findMap(
        p => p.id === playlistId,
        p => p.color?.type === color?.type && p.color?.value === color?.value
            ? Object.merge(p, { color: undefined })
            : Object.merge(p, { color }),
    ))
})
