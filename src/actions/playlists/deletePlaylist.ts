import { Playlists } from "#features/Playlists"
import { PlaylistTree } from "#features/PlaylistTree"
import { autoAnimate } from "#utils/autoAnimate"
import { Array, Object, pipe } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const deletePlaylist = action(async (playlistId: string) => {
    const playlist = Playlists.$byId.get(playlistId)
    if (!playlist) return

    const children = pipe(
        Playlists.$all(),
        PlaylistTree.create,
        tree => PlaylistTree.children(tree, playlistId),
    )

    autoAnimate({
        target: document.querySelector(".sidebar .playlists"),
        filter: element => element.hasAttribute("data-playlist-id"),
    })

    Playlists.$all((ps) => {
        return pipe(
            ps,
            // Remove playlist.
            Array.remove(playlist),
            // Reparent children.
            Array.findMapAll(
                p => Array.includes(children, p),
                Object.merge({ parentId: playlist.parentId }),
            ),
            // Close parent if this was the last child.
            ps => Playlists.closeEmpty(ps),
        )
    })
})
