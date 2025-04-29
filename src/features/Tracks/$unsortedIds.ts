import { Playlists } from "#features/Playlists"
import { Set } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { Tracks } from "."

const $sortedIds = memo(() => {
    return Playlists.$all().reduce((acc, p) => {
        return p.trackIds.reduce((acc, tid) => acc.add(tid), acc)
    }, Set.create<string>())
}, { equals: Set.isShallowEqual })

export const $unsortedIds = memo(() => {
    const sortedIds = $sortedIds()
    return Tracks.$all().reduce((acc, t) => {
        if (!sortedIds.has(t.id)) acc.add(t.id)
        return acc
    }, Set.create<string>())
}, { equals: Set.isShallowEqual })
