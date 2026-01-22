import type { View } from "./types"
import { match } from "@monstermann/fn"

export function key(view: View): string {
    return match
        .shape(view)
        .onCase({ name: "LIBRARY" }, v => v.name)
        .onCase({ name: "RECENTLY_ADDED" }, v => v.name)
        .onCase({ name: "UNSORTED" }, v => v.name)
        .onCase({ name: "PLAYLIST" }, v => `${v.name}-${v.value}`)
        .orThrow()
}
