import type { View } from '@app/types'
import { onDeletePlaylists } from '@app/events'
import { onEvent } from '@app/utils/signals/onEvent'
import { signal } from '@app/utils/signals/signal'
import { shallowEqualObjects } from 'shallow-equal'

export const $playingView = signal<View>(undefined, { equals: shallowEqualObjects })

onEvent(onDeletePlaylists, (playlistIds) => {
    const view = $playingView()

    if (!view) return
    if (view.name !== 'PLAYLIST') return
    if (!playlistIds.has(view.value)) return

    $playingView.set(undefined)
})
