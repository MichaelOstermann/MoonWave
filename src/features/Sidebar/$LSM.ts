import { flow, when } from "@monstermann/fn"
import { LSM } from "@monstermann/lsm"
import { effect, peek, signal } from "@monstermann/signals"
import { Sidebar } from "."
import { Views } from "../Views"

export const $LSM = signal(LSM.create<string>())

effect(() => {
    const selectables = Sidebar
        .$items()
        .filter(view => view.name !== "SECTION")
        .map(view => Views.key(view))

    const position = LSM.lastSelectedIndex(peek($LSM))

    $LSM(flow(
        lsm => LSM.setSelectables(lsm, selectables),
        // Try to stay on the current position when deleting a playlist.
        when(LSM.hasNoSelection, lsm => LSM.goToIndex(lsm, position)),
        // Select the previous one when deleting the last playlist.
        when(LSM.hasNoSelection, lsm => LSM.goToIndex(lsm, position - 1)),
        // Select the library otherwise.
        when(LSM.hasNoSelection, lsm => LSM.goTo(lsm, "LIBRARY")),
    ))
})
