import { onDeleteTracks } from '@app/events'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { effect, onEvent, signal } from '@monstermann/signals'
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
