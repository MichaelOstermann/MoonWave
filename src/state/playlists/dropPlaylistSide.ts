import { $mouseY, computed } from '@monstermann/signals'
import { $dropPlaylistBounds } from './dropPlaylistBounds'

export const $dropPlaylistSide = computed<'above' | 'below'>(() => {
    const bounds = $dropPlaylistBounds()
    if (!bounds) return 'below'
    const mouseY = $mouseY()
    return mouseY < bounds.top + bounds.height / 2 ? 'above' : 'below'
})
