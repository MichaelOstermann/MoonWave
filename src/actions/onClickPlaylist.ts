import { $editingPlaylistId } from '@app/state/editingPlaylistId'
import { $focusedView } from '@app/state/focusedView'
import { action } from '@app/utils/signals/action'
import { openView } from './openView'

export const onClickPlaylist = action((playlistId: string) => {
    $focusedView.set('SIDEBAR')
    if ($editingPlaylistId() === playlistId) return
    openView({ name: 'PLAYLIST', value: playlistId })
})
