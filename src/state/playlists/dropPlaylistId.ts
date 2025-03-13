import { onDeletePlaylists } from '@app/events'
import { effect, onEvent, signal } from '@monstermann/signals'
import { $isDraggingTracks } from '../tracks/isDraggingTracks'
import { $isDraggingPlaylists } from './isDraggingPlaylists'

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
