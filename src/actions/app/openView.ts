import type { View } from "#src/features/Views"
import { LSM } from "#features/LSM"
import { Sidebar } from "#features/Sidebar"
import { action } from "@monstermann/signals"

export const openView = action((view: View) => {
    Sidebar.$LSM(lsm => LSM.selectOne(lsm, view))
})
