import { event } from '../event'

export const onKeyPress = event<KeyboardEvent>()
document.addEventListener('keypress', onKeyPress)
