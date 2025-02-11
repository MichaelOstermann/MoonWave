import type { MouseEvent } from 'react'
import { $focusedView, $tracksLSM } from '@app/state/state'
import { handleMouseEvent } from '@app/utils/lsm/utils/handleMouseEvent'
import { isSelected } from '@app/utils/lsm/utils/isSelected'
import { action } from '@app/utils/signals/action'

export const onClickTrack = action(({ evt, trackId }: {
    evt: MouseEvent
    trackId: string
}) => {
    const wasFocused = $focusedView() === 'MAIN'
    $focusedView.set('MAIN')

    if (!wasFocused && isSelected($tracksLSM(), trackId)) return
    $tracksLSM.map(lsm => handleMouseEvent(lsm, trackId, evt.nativeEvent))
})
