import { $isSidepanelOpen } from '@app/state/sidepanel/isSidepanelOpen'
import { $isTogglingSidepanel } from '@app/state/sidepanel/isTogglingSidepanel'
import { $prepareSidepanel } from '@app/state/sidepanel/prepareSidepanel'
import { action, onCleanup } from '@monstermann/signals'

export const toggleSidepanel = action(async () => {
    $isTogglingSidepanel.set(true)
    $prepareSidepanel.set(false)
    $isSidepanelOpen.map(isOpen => !isOpen)
    const tid = setTimeout(() => $isTogglingSidepanel.set(false), 300)
    onCleanup(() => clearTimeout(tid))
})
