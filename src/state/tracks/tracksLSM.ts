import { clearSelection } from '@app/utils/lsm/utils/clearSelection'
import { createLSM } from '@app/utils/lsm/utils/createLSM'
import { setSelectables } from '@app/utils/lsm/utils/setSelectables'
import { changeEffect, effect, signal } from '@monstermann/signals'
import { $view } from '../sidebar/view'
import { $tracksFilter } from './tracksFilter'
import { $viewingTracks } from './viewingTracks'

export const $tracksLSM = signal(createLSM<string>())

effect(() => {
    const selectables = $viewingTracks().map(t => t.id)
    $tracksLSM.map(lsm => setSelectables(lsm, selectables))
})

changeEffect($view, () => $tracksLSM.map(clearSelection))
changeEffect($tracksFilter, () => $tracksLSM.map(clearSelection))
