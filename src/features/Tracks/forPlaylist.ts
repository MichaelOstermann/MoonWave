import type { Track } from "."
import { Playlists } from "#features/Playlists"
import { Sidebar } from "#features/Sidebar"
import { Array, pipe, withMutations } from "@monstermann/fn"
import { Tracks } from "."

export function forPlaylist(playlistId: string, options?: { applyFilter: boolean }): Track[] {
    return withMutations(() => {
        return pipe(
            playlistId,
            pid => Playlists.$byId.get(pid),
            p => p?.trackIds ?? [],
            Array.mapEach(tid => Tracks.$byId.get(tid)),
            Array.compact(),
            tracks => options?.applyFilter && Sidebar.$search()
                ? Tracks.filter(tracks, Sidebar.$search())
                : Tracks.sort(tracks, { name: "PLAYLIST", value: playlistId }),
        )
    })
}
