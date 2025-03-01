import { $dropPlaylistElement } from '@app/state/dropPlaylistElement'
import { $dropPlaylistId } from '@app/state/dropPlaylistId'
import { action } from '@app/utils/signals/action'

export const onDragEnterPlaylist = action((playlistId: string) => {
    if ($dropPlaylistId() === playlistId) return
    $dropPlaylistId.set(playlistId)
    $dropPlaylistElement.set(document.querySelector(`[data-playlist-id="${playlistId}"]`))
})
