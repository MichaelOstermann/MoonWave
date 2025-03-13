import type { View } from '@app/types'
import { onDeletePlaylists } from '@app/events'
import { onEvent, signal } from '@monstermann/signals'
import { shallowEqualObjects } from 'shallow-equal'

export const $playingView = signal<View>(undefined, { equals: shallowEqualObjects })

onEvent(onDeletePlaylists, (playlistIds) => {
    const view = $playingView()

    if (!view) return
    if (view.name !== 'PLAYLIST') return
    if (!playlistIds.has(view.value)) return

    $playingView.set(undefined)
})
