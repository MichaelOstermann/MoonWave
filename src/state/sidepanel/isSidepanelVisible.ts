import { computed } from '@monstermann/signals'
import { $isSidepanelOpen } from './isSidepanelOpen'
import { $isTogglingSidepanel } from './isTogglingSidepanel'

export const $isSidepanelVisible = computed(() => {
    return $isSidepanelOpen() || $isTogglingSidepanel()
})
