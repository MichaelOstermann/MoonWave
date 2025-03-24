import { event } from '../event'

export const onPointerMove = event<PointerEvent>()
document.addEventListener('pointermove', onPointerMove)
