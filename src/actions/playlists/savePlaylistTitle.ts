import { Playlists } from "#features/Playlists"
import { Sidebar } from "#features/Sidebar"
import { Array, Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"
import { deletePlaylist } from "./deletePlaylist"

export const savePlaylistTitle = action((title: string) => {
    const playlistId = Sidebar.$editingId()
    if (!playlistId) return

    Sidebar.$editingId(null)

    const prevTitle = Playlists.$byId.get(playlistId)?.title || ""
    const nextTitle = title || prevTitle

    if (prevTitle === "" && nextTitle === "") {
        deletePlaylist(playlistId)
    }
    else {
        Playlists.$all(Array.findMap(
            p => p.id === playlistId,
            Object.merge({ title: nextTitle }),
        ))
    }
})
