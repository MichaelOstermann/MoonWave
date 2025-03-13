import { computed } from '@monstermann/signals'
import { $view } from '../sidebar/view'

export const $viewingPlaylistId = computed(() => {
    const view = $view()
    if (view.name !== 'PLAYLIST') return undefined
    return view.value
})
