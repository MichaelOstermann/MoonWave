import { $editingPlaylistId, $focusedView } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const editPlaylistTitle = action((playlistId: string) => {
    $editingPlaylistId.set(playlistId)
})
