import type { View } from "."
import { onDeletePlaylists } from "#src/events"
import { Object } from "@monstermann/fn"
import { signal } from "@monstermann/signals"

export const $playing = signal<View>(undefined, {
    equals(after, before) {
        if (!after && !before) return true
        if (!after || !before) return false
        return Object.isShallowEqual(after, before)
    },
})

onDeletePlaylists((playlistIds) => {
    const view = $playing()

    if (!view) return
    if (view.name !== "PLAYLIST") return
    if (!playlistIds.has(view.value)) return

    $playing(undefined)
})
