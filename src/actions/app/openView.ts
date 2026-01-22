import type { View } from "#src/features/Views"
import { Sidebar } from "#features/Sidebar"
import { Views } from "#src/features/Views"
import { LSM } from "@monstermann/lsm"
import { action } from "@monstermann/signals"

export const openView = action((view: View) => {
    Sidebar.$LSM(lsm => LSM.goTo(lsm, Views.key(view)))
})
