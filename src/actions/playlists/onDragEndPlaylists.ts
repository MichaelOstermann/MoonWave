import { Playlists } from "#features/Playlists"
import { PlaylistTree } from "#features/PlaylistTree"
import { Sidebar } from "#features/Sidebar"
import { autoAnimate } from "#utils/autoAnimate"
import { Array, match, Object, pipe } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const onDragEndPlaylists = action(async () => {
    const targetId = Sidebar.$dropId()
    const tree = PlaylistTree.$tree()
    const forbiddenPlaylistIds = Sidebar.$draggingIds()
        .flatMap(pid => PlaylistTree.collectIds(tree, pid))

    // Prevent playlists from being dropped into one of their descendants.
    if (!targetId || forbiddenPlaylistIds.includes(targetId)) {
        Sidebar.$draggingIds([])
        return
    }

    const side = Sidebar.$dropSide()
    const playlists = Playlists.$all()
    const draggingIds = playlists
        // Collect the dragging ids in order of occurence.
        .filter(p => Sidebar.$draggingIds().includes(p.id))
        .map(p => p.id)
        // Collect the roots by dropping descendants.
        .filter((pid, _, pids) => {
            const parentIds = PlaylistTree.parentIds(tree, pid)
            return !parentIds.some(parentId => pids.includes(parentId))
        })

    const playlistsToMove = draggingIds.flatMap(id => PlaylistTree.collect(tree, id))
    const playlistIdsToMove = playlistsToMove.map(p => p.id)
    const otherPlaylists = playlists.filter(p => !playlistsToMove.includes(p))

    autoAnimate({
        movedElementsHint: playlistIdsToMove.map(id => document.querySelector(`[data-playlist-id="${id}"]`)!),
        target: document.querySelector(".sidebar .playlists"),
        filter: element => element.hasAttribute("data-playlist-id"),
    })

    if (side === "inside") {
        Playlists.bounce(targetId)
    }

    const targetPlaylist = otherPlaylists.find(p => p.id === targetId)!
    const targetIdx = otherPlaylists.indexOf(targetPlaylist)

    const newParentId = match(side)
        .case("inside", targetId)
        .case("below", targetPlaylist.parentId)
        .case("above", targetPlaylist.parentId)
        .orThrow()

    const offset = match(side)
        .case("inside", targetIdx + 1)
        .case("below", targetIdx + 1)
        .case("above", targetIdx)
        .orThrow()

    const newPlaylists = pipe(
        otherPlaylists,
        Array.insertAllAt(offset, playlistsToMove),
        // Reparent roots.
        ps => Array.findMapAll(
            ps,
            p => draggingIds.includes(p.id),
            Object.merge({ parentId: newParentId }),
        ),
        ps => Playlists.closeEmpty(ps),
    )

    Playlists.$all(newPlaylists)
    Sidebar.$draggingIds([])
})
