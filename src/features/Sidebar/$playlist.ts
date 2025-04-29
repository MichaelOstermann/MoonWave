import { Playlists } from "#features/Playlists"
import { memo } from "@monstermann/signals"
import { Sidebar } from "."

export const $playlist = memo(() => {
    const id = Sidebar.$playlistId()
    return id ? Playlists.$byId.get(id) : undefined
})
