import type { Mode } from '@app/types'
import { computed } from '@app/utils/signals/computed'
import { $config } from './config'
import { $playingView } from './playingView'
import { $playlistsById } from './playlistsById'
import { $view } from './view'

export const $playingMode = computed<Mode>(() => {
    const view = $playingView() ?? $view()
    switch (view.name) {
        case 'LIBRARY': return $config().libraryMode ?? 'SHUFFLE'
        case 'RECENTLY_ADDED': return $config().recentlyAddedMode ?? 'SHUFFLE'
        case 'UNSORTED': return $config().unsortedMode ?? 'SHUFFLE'
        case 'PLAYLIST': return $playlistsById(view.value)()?.mode ?? 'SHUFFLE'
    }
})
