import { hasSelection } from '@app/utils/lsm/utils/hasSelection'
import { effect, signal } from '@monstermann/signals'
import { $tracksLSM } from './tracksLSM'

export const $isDraggingTracks = signal(false)

effect(() => {
    if (hasSelection($tracksLSM())) return
    $isDraggingTracks.set(false)
})
