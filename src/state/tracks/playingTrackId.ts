import { onDeleteTracks } from '@app/events'
import { onEvent, signal } from '@monstermann/signals'

export const $playingTrackId = signal<string>(undefined)

onEvent(onDeleteTracks, (trackIds) => {
    const trackId = $playingTrackId()
    if (!trackId) return
    if (!trackIds.has(trackId)) return
    $playingTrackId.set(undefined)
})
