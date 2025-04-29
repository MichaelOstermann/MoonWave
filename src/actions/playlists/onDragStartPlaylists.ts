import { Sidebar } from "#features/Sidebar"
import { action } from "@monstermann/signals"
import { onDragEndPlaylists } from "./onDragEndPlaylists"

export const onDragStartPlaylists = action((playlistId: string) => {
    Sidebar.$draggingIds([playlistId])

    const ac = new AbortController()
    document.addEventListener("pointerup", () => {
        ac.abort()
        onDragEndPlaylists()
    }, { signal: ac.signal })
})
