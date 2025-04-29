import { Sidepanel } from "#features/Sidepanel"
import { action, onCleanup } from "@monstermann/signals"

export const toggleSidepanel = action(async () => {
    Sidepanel.$isToggling(true)
    Sidepanel.$isOpen(isOpen => !isOpen)
    const tid = setTimeout(() => Sidepanel.$isToggling(false), 200)
    onCleanup(() => clearTimeout(tid))
})
