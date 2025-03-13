import { onDeleteTracks } from '@app/events'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { changeEffect, onEvent, signal } from '@monstermann/signals'
import { $playingView } from '../sidebar/playingView'

export const $prevPlayedTrackIds = signal<string[]>([])

changeEffect($playingView, () => $prevPlayedTrackIds.set([]))

onEvent(onDeleteTracks, (tids) => {
    $prevPlayedTrackIds.map(findAndRemoveAll(tid => tids.has(tid)))
})
