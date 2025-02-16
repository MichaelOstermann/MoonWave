import { $dropPlaylistElement, $dropPlaylistId, $view } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onDragEnterPlaylist = action((playlistId: string) => {
    if ($dropPlaylistId.value === playlistId) return
    $dropPlaylistId.set(playlistId)
    $dropPlaylistElement.set(document.querySelector(`[data-playlist-id="${playlistId}"]`))
})
