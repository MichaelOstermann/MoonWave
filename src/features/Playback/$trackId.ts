import { onDeleteTracks } from "#src/events"
import { signal } from "@monstermann/signals"

export const $trackId = signal<string>(undefined)

onDeleteTracks((trackIds) => {
    const trackId = $trackId()
    if (!trackId) return
    if (!trackIds.has(trackId)) return
    $trackId(undefined)
})
