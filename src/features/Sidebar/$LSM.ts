import type { View } from "../Views"
import { LSM } from "#features/LSM"
import { flow, when } from "@monstermann/fn"
import { effect, peek, signal } from "@monstermann/signals"
import { Sidebar } from "."

export const $LSM = signal(LSM.createLSM<View>({
    muliselection: false,
    getKey: view => "value" in view
        ? `${view.name}-${view.value}`
        : view.name,
}))

effect(() => {
    const selectables = Sidebar.$items().filter(i => i.name !== "SECTION")
    const position = LSM.getLastSelectionPosition(peek($LSM))

    $LSM(flow(
        lsm => LSM.setSelectables(lsm, selectables),
        // Try to stay on the current position when deleting a playlist.
        when(LSM.hasNoSelection, lsm => LSM.selectPosition(lsm, position)),
        // Select the previous one when deleting the last playlist.
        when(LSM.hasNoSelection, lsm => LSM.selectPosition(lsm, position - 1)),
        // Select the library otherwise.
        when(LSM.hasNoSelection, lsm => LSM.selectOne(lsm, { name: "LIBRARY" })),
    ))
})
