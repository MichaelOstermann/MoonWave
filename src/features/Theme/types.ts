export type Color =
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "blue"
    | "cyan"
    | "purple"
    | "pink"

export type ThemeMode =
    | "light"
    | "dark"

export type ThemeName =
    | "catppuccin-dark"
    | "catppuccin-light"
    | "dusk-dark"
    | "dust-light"
    | "gruvbox-dark"
    | "gruvbox-light"
    | "kanagawa-dark"
    | "moon-dark"
    | "nord-dark"
    | "rose-pine-dark"
    | "rose-pine-light"
    | "tokyo-night-dark"
    | "tokyo-night-light"
    | "wave-light"

export type WaveformThemeName =
    | "hifi"
    | "bars-center"
    | "bars-bottom"

export type ThemeNameDark = Extract<ThemeName, `${string}-dark`>

export type ThemeNameLight = Extract<ThemeName, `${string}-light`>

export type WaveformTheme = {
    barAlign: "top" | "bottom" | undefined
    barGap: number | undefined
    barRadius: number | undefined
    barWidth: number | undefined
}
