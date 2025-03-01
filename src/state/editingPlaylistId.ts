import { onDeletePlaylists } from '@app/events'
import { onEvent } from '@app/utils/signals/onEvent'
import { signal } from '@app/utils/signals/signal'

export const $editingPlaylistId = signal<string>(null)

onEvent(onDeletePlaylists, (playlistIds) => {
    const playlistId = $editingPlaylistId()
    if (!playlistId) return

    const isDeleted = playlistIds.has(playlistId)
    if (!isDeleted) return

    $editingPlaylistId.set(null)
})
