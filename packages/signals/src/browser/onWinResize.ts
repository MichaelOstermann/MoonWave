import { event } from '../event'

export const onWinResize = event<UIEvent>()
window.addEventListener('resize', onWinResize)
