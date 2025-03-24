import { event } from '../event'

export const onKeyUp = event<KeyboardEvent>()
document.addEventListener('keyup', onKeyUp)
