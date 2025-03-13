import type { Mode } from '@app/types'
import { $config } from '@app/state/app/config'
import { $playlists } from '@app/state/playlists/playlists'
import { $playingView } from '@app/state/sidebar/playingView'
import { $view } from '@app/state/sidebar/view'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'
import { match } from 'ts-pattern'

export const setMode = action((mode: Mode) => {
    match($playingView() ?? $view())
        .with({ name: 'LIBRARY' }, () => $config.map(merge({ libraryMode: mode })))
        .with({ name: 'RECENTLY_ADDED' }, () => $config.map(merge({ recentlyAddedMode: mode })))
        .with({ name: 'UNSORTED' }, () => $config.map(merge({ unsortedMode: mode })))
        .with({ name: 'PLAYLIST' }, view => $playlists.map(findAndMap(
            p => p.id === view.value,
            p => merge(p, { mode }),
        )))
        .exhaustive()
})
