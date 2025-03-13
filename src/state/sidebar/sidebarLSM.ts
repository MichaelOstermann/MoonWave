import type { View } from '@app/types'
import { createLSM } from '@app/utils/lsm/utils/createLSM'
import { getLastSelectionPosition } from '@app/utils/lsm/utils/getLastSelectionPosition'
import { hasSelection } from '@app/utils/lsm/utils/hasSelection'
import { selectOne } from '@app/utils/lsm/utils/selectOne'
import { selectPosition } from '@app/utils/lsm/utils/selectPosition'
import { setSelectables } from '@app/utils/lsm/utils/setSelectables'
import { effect, signal } from '@monstermann/signals'
import { $sidebarItems } from './sidebarItems'

export const $sidebarLSM = signal(createLSM<View>({
    muliselection: false,
    getKey: view => 'value' in view
        ? `${view.name}-${view.value}`
        : view.name,
}))

effect(() => {
    const selectables = $sidebarItems().filter(i => i.name !== 'SECTION')
    const position = getLastSelectionPosition($sidebarLSM.peek())

    $sidebarLSM.map((lsm) => {
        lsm = setSelectables(lsm, selectables)
        // Try to stay on the current position when deleting a playlist.
        if (!hasSelection(lsm)) lsm = selectPosition(lsm, position)
        // Select the previous one when deleting the last playlist.
        if (!hasSelection(lsm)) lsm = selectPosition(lsm, position - 1)
        // Select the library otherwise.
        if (!hasSelection(lsm)) lsm = selectOne(lsm, { name: 'LIBRARY' })
        return lsm
    })
})
