import { Config } from "#features/Config"
import { Theme } from "#features/Theme"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const toggleThemeMode = action(() => {
    const themeMode = Theme.$mode() === "light" ? "dark" : "light"
    Config.$config(Object.merge({ themeMode }))
})
