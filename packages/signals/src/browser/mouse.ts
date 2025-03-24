import { onEvent } from '../onEvent'
import { signal } from '../signal'
import { onPointerMove } from './onPointerMove'

export const $mouseX = signal(0)
export const $mouseY = signal(0)

onEvent(onPointerMove, (evt) => {
    $mouseX.set(evt.clientX)
    $mouseY.set(evt.clientY)
})
