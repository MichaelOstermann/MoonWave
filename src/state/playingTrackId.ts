import { onDeleteTracks } from '@app/events'
import { onEvent } from '@app/utils/signals/onEvent'
import { signal } from '@app/utils/signals/signal'

export const $playingTrackId = signal<string>(undefined)

onEvent(onDeleteTracks, (trackIds) => {
    const trackId = $playingTrackId()
    if (!trackId) return
    if (!trackIds.has(trackId)) return
    $playingTrackId.set(undefined)
})
