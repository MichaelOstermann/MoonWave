import { pipe } from '@app/utils/data/pipe'
import { $winWidth, computed } from '@monstermann/signals'
import { $sidebarWidth } from '../sidebar/sidebarWidth'
import { $isSidepanelOpen } from '../sidepanel/isSidepanelOpen'
import { $sidepanelWidth } from '../sidepanel/sidepanelWidth'

export const $mainWidth = computed(() => pipe(
    $winWidth(),
    w => w - $sidebarWidth(),
    w => w - ($isSidepanelOpen() ? $sidepanelWidth() : 0),
))
