import { $dropPlaylistId, $view } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onDragEnterPlaylist = action((playlistId: string) => {
    if ($dropPlaylistId.value === playlistId) return
    if ($view.value.name === 'PLAYLIST' && $view.value.value === playlistId) return
    $dropPlaylistId.set(playlistId)
})
