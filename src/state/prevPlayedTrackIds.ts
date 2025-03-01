import { onDeleteTracks } from '@app/events'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { changeEffect } from '@app/utils/signals/changeEffect'
import { onEvent } from '@app/utils/signals/onEvent'
import { signal } from '@app/utils/signals/signal'
import { $playingView } from './playingView'

export const $prevPlayedTrackIds = signal<string[]>([])

changeEffect($playingView, () => $prevPlayedTrackIds.set([]))

onEvent(onDeleteTracks, (tids) => {
    $prevPlayedTrackIds.map(findAndRemoveAll(tid => tids.has(tid)))
})
