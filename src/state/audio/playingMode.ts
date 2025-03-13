import type { Mode } from '@app/types'
import { computed } from '@monstermann/signals'
import { $config } from '../app/config'
import { $playlistsById } from '../playlists/playlistsById'
import { $playingView } from '../sidebar/playingView'
import { $view } from '../sidebar/view'

export const $playingMode = computed<Mode>(() => {
    const view = $playingView() ?? $view()
    switch (view.name) {
        case 'LIBRARY': return $config().libraryMode ?? 'SHUFFLE'
        case 'RECENTLY_ADDED': return $config().recentlyAddedMode ?? 'SHUFFLE'
        case 'UNSORTED': return $config().unsortedMode ?? 'SHUFFLE'
        case 'PLAYLIST': return $playlistsById(view.value)()?.mode ?? 'SHUFFLE'
    }
})
