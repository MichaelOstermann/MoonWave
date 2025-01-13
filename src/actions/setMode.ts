import type { Mode } from '@app/types'
import { $config, $playingView, $playlists, $view } from '@app/state/state'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { setPlaylistMode } from '@app/utils/playlist/setPlaylistMode'
import { action } from '@app/utils/signals/action'
import { match } from 'ts-pattern'

export const setMode = action((mode: Mode) => {
    match($playingView.value ?? $view.value)
        .with({ name: 'LIBRARY' }, () => $config.map(merge({ libraryMode: mode })))
        .with({ name: 'RECENTLY_ADDED' }, () => $config.map(merge({ recentlyAddedMode: mode })))
        .with({ name: 'UNSORTED' }, () => $config.map(merge({ unsortedMode: mode })))
        .with({ name: 'PLAYLIST' }, view => $playlists.map(findAndMap(
            p => p.id === view.value,
            p => setPlaylistMode(p, mode),
        )))
        .exhaustive()
})
