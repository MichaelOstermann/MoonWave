import { App } from "#features/App"
import { TrackList } from "#features/TrackList"
import { onDeletePlaylists } from "#src/events"
import { effect, signal } from "@monstermann/signals"
import { Sidebar } from "."

export const $dropId = signal<string>(null)

effect(() => {
    if (TrackList.$isDragging()) return
    if (Sidebar.$isDragging()) return
    if (App.$isDraggingFiles()) return
    $dropId(null)
})

onDeletePlaylists((playlistIds) => {
    const playlistId = $dropId()
    if (!playlistId) return

    const isDeleted = playlistIds.has(playlistId)
    if (!isDeleted) return

    $dropId(null)
})
