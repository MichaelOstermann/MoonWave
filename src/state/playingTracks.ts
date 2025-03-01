import type { Track } from '@app/types'
import { getTracksForLibrary } from '@app/utils/getTracksForLibrary'
import { getTracksForPlaylist } from '@app/utils/getTracksForPlaylist'
import { getTracksForRecentlyAdded } from '@app/utils/getTracksForRecentlyAdded'
import { getTracksForUnsorted } from '@app/utils/getTracksForUnsorted'
import { computed } from '@app/utils/signals/computed'
import { $playingView } from './playingView'
import { $view } from './view'

export const $playingTracks = computed<Track[]>(() => {
    const view = $playingView() ?? $view()
    switch (view.name) {
        case 'LIBRARY': return getTracksForLibrary({ applyFilter: true })
        case 'RECENTLY_ADDED': return getTracksForRecentlyAdded({ applyFilter: true })
        case 'UNSORTED': return getTracksForUnsorted({ applyFilter: true })
        case 'PLAYLIST': return getTracksForPlaylist(view.value, { applyFilter: true })
    }
})
