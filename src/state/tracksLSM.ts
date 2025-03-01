import { clearSelection } from '@app/utils/lsm/utils/clearSelection'
import { createLSM } from '@app/utils/lsm/utils/createLSM'
import { setSelectables } from '@app/utils/lsm/utils/setSelectables'
import { changeEffect } from '@app/utils/signals/changeEffect'
import { effect } from '@app/utils/signals/effect'
import { signal } from '@app/utils/signals/signal'
import { $tracksFilter } from './tracksFilter'
import { $view } from './view'
import { $viewingTracks } from './viewingTracks'

export const $tracksLSM = signal(createLSM<string>())

effect(() => {
    const selectables = $viewingTracks().map(t => t.id)
    $tracksLSM.map(lsm => setSelectables(lsm, selectables))
})

changeEffect($view, () => $tracksLSM.map(clearSelection))
changeEffect($tracksFilter, () => $tracksLSM.map(clearSelection))
