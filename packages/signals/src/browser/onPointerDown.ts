import { event } from '../event'

export const onPointerDown = event<PointerEvent>()
document.addEventListener('pointerdown', onPointerDown)
