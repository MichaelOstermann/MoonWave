import { $dropPlaylistId } from '@app/state/dropPlaylistId'
import { action } from '@app/utils/signals/action'

export const onDragLeavePlaylist = action((playlistId: string) => {
    if ($dropPlaylistId() !== playlistId) return
    $dropPlaylistId.set(null)
})
