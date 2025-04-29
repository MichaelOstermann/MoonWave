import type { ThemeNameDark, ThemeNameLight } from "#src/features/Theme"

type Themes = {
    dark: ThemeNameDark[]
    light: ThemeNameLight[]
}

export const themes: Themes = {
    dark: [
        "moon-dark",
        "dusk-dark",
        "tokyo-night-dark",
        "kanagawa-dark",
        "rose-pine-dark",
        "catppuccin-dark",
        "nord-dark",
        "gruvbox-dark",
    ],
    light: [
        "wave-light",
        "dust-light",
        "catppuccin-light",
        "tokyo-night-light",
        "rose-pine-light",
        "gruvbox-light",
    ],
}
