import { $dropPlaylistId } from '@app/state/playlists/dropPlaylistId'
import { action } from '@monstermann/signals'

export const onDragLeavePlaylist = action((playlistId: string) => {
    if ($dropPlaylistId() !== playlistId) return
    $dropPlaylistId.set(null)
})
