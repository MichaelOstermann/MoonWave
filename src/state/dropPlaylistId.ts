import { onDeletePlaylists } from '@app/events'
import { effect } from '@app/utils/signals/effect'
import { onEvent } from '@app/utils/signals/onEvent'
import { signal } from '@app/utils/signals/signal'
import { $isDraggingPlaylists } from './isDraggingPlaylists'
import { $isDraggingTracks } from './isDraggingTracks'

export const $dropPlaylistId = signal<string>(null)

effect(() => {
    if ($isDraggingTracks()) return
    if ($isDraggingPlaylists()) return
    $dropPlaylistId.set(null)
})

onEvent(onDeletePlaylists, (playlistIds) => {
    const playlistId = $dropPlaylistId()
    if (!playlistId) return

    const isDeleted = playlistIds.has(playlistId)
    if (!isDeleted) return

    $dropPlaylistId.set(null)
})
