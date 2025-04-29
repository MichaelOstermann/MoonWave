import type { ThemeName } from "."
import { memo } from "@monstermann/signals"
import { Theme } from "."

export const $name = memo<ThemeName>(() => {
    return Theme.$mode() === "light"
        ? Theme.$lightName()
        : Theme.$darkName()
})
