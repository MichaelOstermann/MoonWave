import { $dropPlaylistElement } from '@app/state/playlists/dropPlaylistElement'
import { $dropPlaylistId } from '@app/state/playlists/dropPlaylistId'
import { action } from '@monstermann/signals'

export const onDragEnterPlaylist = action((playlistId: string) => {
    if ($dropPlaylistId() === playlistId) return
    $dropPlaylistId.set(playlistId)
    $dropPlaylistElement.set(document.querySelector(`[data-playlist-id="${playlistId}"]`))
})
