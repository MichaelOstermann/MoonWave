import { onDeleteTracks } from '@app/events'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { changeEffect } from '@app/utils/signals/changeEffect'
import { onEvent } from '@app/utils/signals/onEvent'
import { signal } from '@app/utils/signals/signal'
import { $playingView } from './playingView'

export const $nextPlayedTrackIds = signal<string[]>([])

changeEffect($playingView, () => $nextPlayedTrackIds.set([]))

onEvent(onDeleteTracks, (tids) => {
    $nextPlayedTrackIds.map(findAndRemoveAll(tid => tids.has(tid)))
})
