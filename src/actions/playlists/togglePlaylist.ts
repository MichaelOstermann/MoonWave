import { LSM } from "#features/LSM"
import { Playlists } from "#features/Playlists"
import { PlaylistTree } from "#features/PlaylistTree"
import { Sidebar } from "#features/Sidebar"
import { Array, Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const togglePlaylist = action((playlistId: string) => {
    const tree = PlaylistTree.$tree()
    if (!PlaylistTree.hasChildren(tree, playlistId)) return

    const playlistBefore = Playlists.$byId.get(playlistId)
    if (!playlistBefore) return

    const playlistAfter = Object.merge(playlistBefore, {
        expanded: playlistBefore.expanded ? undefined : true,
    })

    // When collapsing, select the collapsed playlist if the current one gets unselected as a result.
    const isCollapsing = !playlistAfter.expanded
    const currentPlaylistId = Sidebar.$playlistId()
    const playlistIds = PlaylistTree.collectIds(tree, playlistId)
    if (isCollapsing && currentPlaylistId && playlistIds.includes(currentPlaylistId))
        Sidebar.$LSM(lsm => LSM.selectOne(lsm, { name: "PLAYLIST", value: playlistId }))

    Playlists.$all(Array.replace(
        playlistBefore,
        playlistAfter,
    ))
})
