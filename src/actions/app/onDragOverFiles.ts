import { Sidebar } from "#features/Sidebar"
import { action } from "@monstermann/signals"

export const onDragOverFiles = action((position: { x: number, y: number }) => {
    const playlistId = document
        .elementsFromPoint(position.x, position.y)
        .find(e => e.hasAttribute("data-playlist-id"))
        ?.getAttribute("data-playlist-id")

    Sidebar.$dropId(playlistId || null)
})
