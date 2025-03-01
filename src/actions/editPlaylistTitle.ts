import { $editingPlaylistId } from '@app/state/editingPlaylistId'
import { action } from '@app/utils/signals/action'

export const editPlaylistTitle = action((playlistId: string) => {
    $editingPlaylistId.set(playlistId)
})
