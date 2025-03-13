import { $editingPlaylistId } from '@app/state/playlists/editingPlaylistId'
import { action } from '@monstermann/signals'

export const editPlaylistTitle = action((playlistId: string) => {
    $editingPlaylistId.set(playlistId)
})
