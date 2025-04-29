import { Sidebar } from "#features/Sidebar"
import { action } from "@monstermann/signals"

export const onDragLeavePlaylist = action((playlistId: string) => {
    if (Sidebar.$dropId() !== playlistId) return
    Sidebar.$dropId(null)
})
