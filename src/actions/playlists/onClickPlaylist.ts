import { $editingPlaylistId } from '@app/state/playlists/editingPlaylistId'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { action } from '@monstermann/signals'
import { openView } from '../app/openView'

export const onClickPlaylist = action((playlistId: string) => {
    $focusedView.set('SIDEBAR')
    if ($editingPlaylistId() === playlistId) return
    openView({ name: 'PLAYLIST', value: playlistId })
})
