import type { MouseEvent } from 'react'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { $tracksLSM } from '@app/state/tracks/tracksLSM'
import { handleMouseEvent } from '@app/utils/lsm/utils/handleMouseEvent'
import { isSelected } from '@app/utils/lsm/utils/isSelected'
import { action } from '@monstermann/signals'

export const onClickTrack = action(({ evt, trackId }: {
    evt: MouseEvent
    trackId: string
}) => {
    const wasFocused = $focusedView() === 'MAIN'
    $focusedView.set('MAIN')

    if (!wasFocused && isSelected($tracksLSM(), trackId)) return
    $tracksLSM.map(lsm => handleMouseEvent(lsm, trackId, evt.nativeEvent))
})
