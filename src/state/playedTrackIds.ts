import { onDeleteTracks } from '@app/events'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { effect } from '@app/utils/signals/effect'
import { onEvent } from '@app/utils/signals/onEvent'
import { signal } from '@app/utils/signals/signal'
import { $playingTrackId } from './playingTrackId'

export const $playedTrackIds = signal<string[]>([])

effect(() => {
    const trackId = $playingTrackId()
    if (!trackId) return
    if ($playedTrackIds.peek().includes(trackId)) return
    $playedTrackIds.map(tids => [...tids, trackId])
})

onEvent(onDeleteTracks, (tids) => {
    $playedTrackIds.map(findAndRemoveAll(tid => tids.has(tid)))
})
