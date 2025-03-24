import { onEvent } from '../onEvent'
import { signal } from '../signal'
import { onWinResize } from './onWinResize'

export const $winWidth = signal(window.innerWidth)
export const $winHeight = signal(window.innerHeight)

onEvent(onWinResize, () => {
    $winWidth.set(window.innerWidth)
    $winHeight.set(window.innerHeight)
})
