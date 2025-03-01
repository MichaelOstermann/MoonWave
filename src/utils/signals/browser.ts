import { event } from './event'
import { onEvent } from './onEvent'
import { signal } from './signal'

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

export const $mouseX = signal(0)
export const $mouseY = signal(0)
export const $winWidth = signal(window.innerWidth)
export const $winHeight = signal(window.innerHeight)
export const $prefersDarkMode = signal(prefersDarkMode.matches)

export const onKeyDown = event<KeyboardEvent>()
export const onPointerDown = event<PointerEvent>()
export const onPointerMove = event<PointerEvent>()
export const onPointerUp = event<PointerEvent>()
export const onResize = event<UIEvent>()
export const onMediaSessionPlay = event<MediaSessionActionDetails>()
export const onMediaSessionPause = event<MediaSessionActionDetails>()
export const onMediaSessionStop = event<MediaSessionActionDetails>()
export const onMediaSessionPreviousTrack = event<MediaSessionActionDetails>()
export const onMediaSessionNextTrack = event<MediaSessionActionDetails>()

prefersDarkMode.addEventListener('change', event => $prefersDarkMode.set(event.matches))
window.addEventListener('resize', onResize)
document.addEventListener('pointerdown', onPointerDown)
document.addEventListener('pointermove', onPointerMove, { passive: true })
document.addEventListener('pointerup', onPointerUp)
document.addEventListener('keydown', onKeyDown)
navigator.mediaSession.setActionHandler('play', onMediaSessionPlay)
navigator.mediaSession.setActionHandler('pause', onMediaSessionPause)
navigator.mediaSession.setActionHandler('stop', onMediaSessionStop)
navigator.mediaSession.setActionHandler('previoustrack', onMediaSessionPreviousTrack)
navigator.mediaSession.setActionHandler('nexttrack', onMediaSessionNextTrack)

onEvent(onPointerMove, (evt) => {
    $mouseX.set(evt.clientX)
    $mouseY.set(evt.clientY)
})

onEvent(onResize, () => {
    $winWidth.set(window.innerWidth)
    $winHeight.set(window.innerHeight)
})
