import type { MouseEvent } from 'react'
import { $focusedView, $tracksLSM } from '@app/state/state'
import { handleMouseEvent } from '@app/utils/lsm/utils/handleMouseEvent'
import { action } from '@app/utils/signals/action'

export const onClickTrack = action(({ evt, trackId }: {
    evt: MouseEvent
    trackId: string
}) => {
    $focusedView.set('MAIN')
    $tracksLSM.map(lsm => handleMouseEvent(lsm, trackId, evt.nativeEvent))
})
