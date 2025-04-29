import type { PlaylistIcon } from "#features/Playlists"
import { Playlists } from "#features/Playlists"
import { Array, Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const setPlaylistIcon = action(({ icon, playlistId }: {
    icon: PlaylistIcon | undefined
    playlistId: string
}) => {
    Playlists.$all(Array.findMap(
        p => p.id === playlistId,
        p => p.icon?.type === icon?.type && p.icon?.value === icon?.value
            ? Object.merge(p, { icon: undefined })
            : Object.merge(p, { icon }),
    ))
})
