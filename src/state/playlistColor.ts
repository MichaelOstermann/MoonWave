import { computed } from '@app/utils/signals/computed'
import { $playlistsById } from './playlistsById'
import { $view } from './view'

export const $playlistColor = computed(() => {
    const view = $view()
    if (view.name !== 'PLAYLIST') return undefined
    return $playlistsById(view.value)()?.color
})
