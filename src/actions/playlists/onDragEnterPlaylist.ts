import { $draggingPlaylistIds } from '@app/state/playlists/draggingPlaylistIds'
import { $dropPlaylistElement } from '@app/state/playlists/dropPlaylistElement'
import { $dropPlaylistId } from '@app/state/playlists/dropPlaylistId'
import { $playlistTree } from '@app/state/playlists/playlistTree'
import { collectPlaylistIds } from '@app/utils/playlist/collectPlaylistIds'
import { action } from '@monstermann/signals'

export const onDragEnterPlaylist = action((playlistId: string) => {
    if ($dropPlaylistId() === playlistId)
        return

    const tree = $playlistTree()
    const forbiddenPlaylistIds = $draggingPlaylistIds()
        .flatMap(pid => collectPlaylistIds(pid, tree))

    if (forbiddenPlaylistIds.includes(playlistId))
        return $dropPlaylistId.set(null)

    $dropPlaylistId.set(playlistId)
    $dropPlaylistElement.set(document.querySelector(`[data-playlist-id="${playlistId}"]`))
})
