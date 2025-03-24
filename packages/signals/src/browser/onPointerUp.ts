import { event } from '../event'

export const onPointerUp = event<PointerEvent>()
document.addEventListener('pointerup', onPointerUp)
