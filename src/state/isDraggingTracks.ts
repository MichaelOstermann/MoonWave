import { hasSelection } from '@app/utils/lsm/utils/hasSelection'
import { effect } from '@app/utils/signals/effect'
import { signal } from '@app/utils/signals/signal'
import { $tracksLSM } from './tracksLSM'

export const $isDraggingTracks = signal(false)

effect(() => {
    if (hasSelection($tracksLSM())) return
    $isDraggingTracks.set(false)
})
