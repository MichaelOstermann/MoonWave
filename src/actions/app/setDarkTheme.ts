import type { ThemeNameDark } from "#src/features/Theme"
import { Config } from "#features/Config"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const setDarkTheme = action((darkThemeName: ThemeNameDark) => {
    Config.$config(Object.merge({ darkThemeName }))
})
