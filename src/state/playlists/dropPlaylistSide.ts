import { $mouseY, computed } from '@monstermann/signals'
import { $dropPlaylistBounds } from './dropPlaylistBounds'

export const $dropPlaylistSide = computed<'above' | 'below' | 'inside'>(() => {
    const bounds = $dropPlaylistBounds()
    if (!bounds) return 'below'
    const mouseY = $mouseY()

    if (mouseY <= bounds.top + bounds.height / 4) return 'above'
    if (mouseY >= bounds.bottom - bounds.height / 4) return 'below'
    return 'inside'
})
