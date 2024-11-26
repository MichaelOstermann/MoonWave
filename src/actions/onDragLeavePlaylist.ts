import { $dropPlaylistId } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onDragLeavePlaylist = action((playlistId: string) => {
    if ($dropPlaylistId.value !== playlistId) return
    $dropPlaylistId.set(null)
})
