import type { View } from '@app/types'
import { $sidebarLSM } from '@app/state/state'
import { selectOne } from '@app/utils/lsm/utils/selectOne'
import { action } from '@app/utils/signals/action'

export const openView = action((view: View) => {
    $sidebarLSM.map(lsm => selectOne(lsm, view))
})
