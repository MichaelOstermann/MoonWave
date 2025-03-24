import { onDeleteTracks } from '@app/events'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { onChange, onEvent, signal } from '@monstermann/signals'
import { $playingView } from '../sidebar/playingView'

export const $prevPlayedTrackIds = signal<string[]>([])

onChange($playingView, () => $prevPlayedTrackIds.set([]))

onEvent(onDeleteTracks, (tids) => {
    $prevPlayedTrackIds.map(findAndRemoveAll(tid => tids.has(tid)))
})
