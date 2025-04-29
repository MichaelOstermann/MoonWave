import type { Track } from "."
import { Sidebar } from "#features/Sidebar"
import { pipe, withMutations } from "@monstermann/fn"
import { Tracks } from "."

export function forRecentlyAdded(options?: { applyFilter: boolean }): Track[] {
    return withMutations(() => {
        return pipe(
            Tracks.$all(),
            tracks => options?.applyFilter && Sidebar.$search()
                ? Tracks.filter(tracks, Sidebar.$search())
                : Tracks.sort(tracks, { name: "RECENTLY_ADDED" }),
        )
    })
}
