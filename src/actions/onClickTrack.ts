import type { MouseEvent } from 'react'
import { $tracksLSM } from '@app/state/state'
import { handleMouseEvent } from '@app/utils/lsm/utils/handleMouseEvent'
import { action } from '@app/utils/signals/action'

export const onClickTrack = action(({ evt, trackId }: {
    evt: MouseEvent
    trackId: string
}) => {
    $tracksLSM.map(lsm => handleMouseEvent(lsm, trackId, evt.nativeEvent))
})
