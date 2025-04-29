import type { Mode } from "../Playback"
import type { ThemeMode, ThemeNameDark, ThemeNameLight, WaveformThemeName } from "../Theme"

export type Config = {
    darkThemeName?: ThemeNameDark
    lightThemeName?: ThemeNameLight
    mode?: Mode
    sidebarWidth?: number
    themeMode?: ThemeMode
    waveformTheme?: WaveformThemeName
}
