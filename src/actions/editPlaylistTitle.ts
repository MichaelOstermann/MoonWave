import { $editingPlaylistId, $focusedView, $showCommandMenu } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const editPlaylistTitle = action((playlistId: string) => {
    $focusedView.set('SIDEBAR')
    $showCommandMenu.set(false)
    $editingPlaylistId.set(playlistId)
})
