import type { Config, Mode } from '@app/types'
import { $config, $playingView, $playlists, $view } from '@app/state/state'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { action } from '@app/utils/signals/action'
import { match } from 'ts-pattern'

export const setMode = action((mode: Mode) => {
    match($playingView.value ?? $view.value)
        .with({ name: 'LIBRARY' }, () => setConfigMode(mode, 'library'))
        .with({ name: 'RECENTLY_ADDED' }, () => setConfigMode(mode, 'recentlyAdded'))
        .with({ name: 'UNSORTED' }, () => setConfigMode(mode, 'unsorted'))
        .with({ name: 'PLAYLIST' }, view => $playlists.map(findAndMap(
            p => p.id === view.value,
            p => ({ ...p, mode }),
        )))
        .exhaustive()
})

function setConfigMode(mode: Mode, name: keyof Exclude<Config['modes'], undefined>): void {
    $config.map((config) => {
        const modes = merge(config.modes ?? {}, { [name]: mode })
        return merge(config, { modes })
    })
}
