import { PlaylistTree } from "#features/PlaylistTree"
import { Sidebar } from "#features/Sidebar"
import { Array } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const onDragEnterPlaylist = action((playlistId: string) => {
    if (Sidebar.$dropId() === playlistId) return

    const tree = PlaylistTree.$tree()
    const forbiddenPlaylistIds = Array.flatMap(
        Sidebar.$draggingIds(),
        pid => PlaylistTree.collectIds(tree, pid),
    )

    if (Array.includes(forbiddenPlaylistIds, playlistId))
        return Sidebar.$dropId(null)

    Sidebar.$dropId(playlistId)
})
