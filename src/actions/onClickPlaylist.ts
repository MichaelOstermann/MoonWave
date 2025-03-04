import { $editingPlaylistId, $focusedView } from '@app/state/state'
import { action } from '@app/utils/signals/action'
import { openView } from './openView'

export const onClickPlaylist = action((playlistId: string) => {
    $focusedView.set('SIDEBAR')
    if ($editingPlaylistId.value === playlistId) return
    openView({ name: 'PLAYLIST', value: playlistId })
})
