import { onDeleteTracks } from '@app/events'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { onChange, onEvent, signal } from '@monstermann/signals'
import { $playingView } from '../sidebar/playingView'

export const $nextPlayedTrackIds = signal<string[]>([])

onChange($playingView, () => $nextPlayedTrackIds.set([]))

onEvent(onDeleteTracks, (tids) => {
    $nextPlayedTrackIds.map(findAndRemoveAll(tid => tids.has(tid)))
})
