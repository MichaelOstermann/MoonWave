import { event } from '../event'

export const onKeyDown = event<KeyboardEvent>()
document.addEventListener('keydown', onKeyDown)
