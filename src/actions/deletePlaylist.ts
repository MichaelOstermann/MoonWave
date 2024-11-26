import { $playlists } from '@app/state/state'
import { findAndRemove } from '@app/utils/data/findAndRemove'
import { action } from '@app/utils/signals/action'

export const deletePlaylist = action((playlistId: string) => {
    $playlists.map(findAndRemove(p => p.id === playlistId))
})
