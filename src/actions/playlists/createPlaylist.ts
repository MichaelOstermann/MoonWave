import { Playlists } from "#features/Playlists"
import { autoAnimate } from "#utils/autoAnimate"
import { Array } from "@monstermann/fn"
import { action } from "@monstermann/signals"
import { nanoid } from "nanoid"
import { editPlaylistTitle } from "./editPlaylistTitle"

export const createPlaylist = action((belowPlaylistId: string | void) => {
    const playlist = {
        id: nanoid(10),
        title: "",
        trackIds: [],
    }

    autoAnimate({
        target: document.querySelector(".sidebar .playlists"),
        filter: element => element.hasAttribute("data-playlist-id"),
    })

    Playlists.$all((ps) => {
        const offset = ps.findIndex(p => p.id === belowPlaylistId) + 1
        return Array.insertAt(ps, offset, playlist)
    })

    editPlaylistTitle(playlist.id)
})
