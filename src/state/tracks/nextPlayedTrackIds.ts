import { onDeleteTracks } from '@app/events'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { changeEffect, onEvent, signal } from '@monstermann/signals'
import { $playingView } from '../sidebar/playingView'

export const $nextPlayedTrackIds = signal<string[]>([])

changeEffect($playingView, () => $nextPlayedTrackIds.set([]))

onEvent(onDeleteTracks, (tids) => {
    $nextPlayedTrackIds.map(findAndRemoveAll(tid => tids.has(tid)))
})
