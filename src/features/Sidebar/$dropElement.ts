import { effect, signal } from "@monstermann/signals"
import { Sidebar } from "."

export const $dropElement = signal<HTMLElement>(null)

effect(() => {
    const playlistId = Sidebar.$dropId()
    if (playlistId) $dropElement(document.querySelector(`[data-playlist-id="${playlistId}"]`) as HTMLElement)
    else $dropElement(null)
})
