import { Sidebar } from "#features/Sidebar"
import { Views } from "#features/Views"
import { action } from "@monstermann/signals"
import { openView } from "../app/openView"

export const onClickPlaylist = action((playlistId: string) => {
    Views.$focused("SIDEBAR")
    if (Sidebar.$editingId() === playlistId) return
    openView({ name: "PLAYLIST", value: playlistId })
})
