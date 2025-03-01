import { $mouseY } from '@app/utils/signals/browser'
import { computed } from '@app/utils/signals/computed'
import { $dropPlaylistBounds } from './dropPlaylistBounds'

export const $dropPlaylistSide = computed<'above' | 'below'>(() => {
    const bounds = $dropPlaylistBounds()
    if (!bounds) return 'below'
    const mouseY = $mouseY()
    return mouseY < bounds.top + bounds.height / 2 ? 'above' : 'below'
})
