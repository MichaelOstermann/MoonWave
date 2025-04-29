import type { ThemeMode } from "#src/features/Theme"
import { Config } from "#features/Config"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const setThemeMode = action((themeMode: ThemeMode) => {
    Config.$config(Object.merge({ themeMode }))
})
