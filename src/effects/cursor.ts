import { App } from "#features/App"
import { Sidebar } from "#features/Sidebar"
import { TrackList } from "#features/TrackList"
import { effect, onCleanup } from "@monstermann/signals"

effect(() => {
    if (TrackList.$isDragging() && Sidebar.$dropId()) setCursor("cursor-copy!")
    if (App.$isDraggingFiles()) setCursor("cursor-copy!")
    if (TrackList.$isDragging()) setCursor("cursor-default!")
    if (Sidebar.$isDragging()) setCursor("cursor-default!")
})

function setCursor(cursor: string): void {
    document.body.classList.add(cursor)
    onCleanup(() => document.body.classList.remove(cursor))
}
