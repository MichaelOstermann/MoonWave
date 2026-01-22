import type { View } from "."
import { Sidebar } from "#features/Sidebar"
import { Object } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { Views } from "."

export const $selected = memo<View>(() => {
    const selected = Sidebar.$LSM().selected.at(0) ?? "LIBRARY"
    return Sidebar
        .$items()
        .filter(view => view.name !== "SECTION")
        .find(item => Views.key(item) === selected)!
}, { equals: Object.isShallowEqual })
