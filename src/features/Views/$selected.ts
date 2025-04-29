import type { View } from "."
import { LSM } from "#features/LSM"
import { Sidebar } from "#features/Sidebar"
import { Array, Object, pipe } from "@monstermann/fn"
import { memo } from "@monstermann/signals"

export const $selected = memo<View>(() => {
    return pipe(
        Sidebar.$LSM(),
        LSM.getSelections,
        Array.firstOr({ name: "LIBRARY" } as View),
    )
}, { equals: Object.isShallowEqual })
