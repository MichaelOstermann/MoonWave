import { Config } from "#features/Config"
import { Sidebar } from "#features/Sidebar"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const onResizeSidebar = action((width: number) => {
    Config.$config(Object.merge({
        sidebarWidth: Sidebar.getWidth(width),
    }))
})
