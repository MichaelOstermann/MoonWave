import type { Track } from "."
import { Sidebar } from "#features/Sidebar"
import { Array, pipe, withMutations } from "@monstermann/fn"
import { Tracks } from "."

export function forUnsorted(options?: { applyFilter: boolean }): Track[] {
    const ids = Tracks.$unsortedIds()
    return withMutations(() => {
        return pipe(
            Tracks.$all(),
            Array.filter(t => ids.has(t.id)),
            tracks => options?.applyFilter && Sidebar.$search()
                ? Tracks.filter(tracks, Sidebar.$search())
                : Tracks.sort(tracks, { name: "UNSORTED" }),
        )
    })
}
