import type { View } from '@app/types'
import { $sidebarLSM } from '@app/state/sidebar/sidebarLSM'
import { selectOne } from '@app/utils/lsm/utils/selectOne'
import { action } from '@monstermann/signals'

export const openView = action((view: View) => {
    $sidebarLSM.map(lsm => selectOne(lsm, view))
})
