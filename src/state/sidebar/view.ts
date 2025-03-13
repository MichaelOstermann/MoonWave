import type { View } from '@app/types'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { computed } from '@monstermann/signals'
import { shallowEqualObjects } from 'shallow-equal'
import { $sidebarLSM } from './sidebarLSM'

export const $view = computed<View>(() => {
    return getSelections($sidebarLSM()).at(0) ?? { name: 'LIBRARY' }
}, { equals: shallowEqualObjects })
