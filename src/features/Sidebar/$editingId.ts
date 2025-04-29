import { onDeletePlaylists } from "#src/events"
import { signal } from "@monstermann/signals"

export const $editingId = signal<string>(null)

onDeletePlaylists((playlistIds) => {
    const playlistId = $editingId()
    if (!playlistId) return

    const isDeleted = playlistIds.has(playlistId)
    if (!isDeleted) return

    $editingId(null)
})
