import type { ThemeNameLight } from "#src/features/Theme"
import { Config } from "#features/Config"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const setLightTheme = action((lightThemeName: ThemeNameLight) => {
    Config.$config(Object.merge({ lightThemeName }))
})
