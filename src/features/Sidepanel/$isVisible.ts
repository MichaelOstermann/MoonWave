import { memo } from "@monstermann/signals"
import { Sidepanel } from "."

export const $isVisible = memo(() => {
    return Sidepanel.$isOpen() || Sidepanel.$isToggling()
})
