import { Sidebar } from "#features/Sidebar"
import { action } from "@monstermann/signals"

export const editPlaylistTitle = action((playlistId: string) => {
    Sidebar.$editingId(playlistId)
})
