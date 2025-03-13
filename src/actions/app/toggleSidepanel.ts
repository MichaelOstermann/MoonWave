import { $isSidepanelOpen } from '@app/state/sidepanel/isSidepanelOpen'
import { $isTogglingSidepanel } from '@app/state/sidepanel/isTogglingSidepanel'
import { action } from '@monstermann/signals'

export const toggleSidepanel = action(async () => {
    $isTogglingSidepanel.set(true)
    $isSidepanelOpen.map(isOpen => !isOpen)
    setTimeout(() => $isTogglingSidepanel.set(false), 500)
})
