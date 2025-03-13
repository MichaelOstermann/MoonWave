import type { IconName } from './config/icons'

export type Color =
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'teal'
    | 'blue'
    | 'cyan'
    | 'purple'
    | 'pink'

export type Mode =
    | 'SINGLE'
    | 'REPEAT'
    | 'SHUFFLE'

export type FocusedView =
    | 'MAIN'
    | 'SIDEBAR'

export type View =
    | { name: 'LIBRARY' }
    | { name: 'RECENTLY_ADDED' }
    | { name: 'UNSORTED' }
    | { name: 'PLAYLIST', value: string }

export type SidebarItem =
    | View
    | { name: 'SECTION', value: string }

export type PlaylistIcon =
    | { type: 'LUCIDE', value: IconName }

export type PlaylistColor =
    | { type: 'PRESET', value: Color }

export type AudioMetadata = {
    mimetype: string
    path: string
    filehash: string
    title: string
    album: string
    artist: string
    duration: number
    size: number
    sampleRate?: number
    bitrate?: number
    year?: number
    trackNr?: number
    diskNr?: number
}

export type Track = AudioMetadata & {
    id: string
    addedAt: number
}

export type Playlist = {
    id: string
    title: string
    trackIds: string[]
    mode?: Mode
    icon?: PlaylistIcon
    color?: PlaylistColor
}

export type Library = {
    tracks: Track[]
    playlists: Playlist[]
}

export type Config = {
    sidebarWidth?: number
    sidepanelWidth?: number
    libraryMode?: Mode
    recentlyAddedMode?: Mode
    unsortedMode?: Mode
    themeMode?: ThemeMode
    darkThemeName?: ThemeNameDark
    lightThemeName?: ThemeNameLight
    waveformTheme?: WaveformThemeName
}

export type ThemeMode =
    | 'light'
    | 'dark'

export type ThemeName =
    | 'catppuccin-dark'
    | 'catppuccin-light'
    | 'dusk-dark'
    | 'dust-light'
    | 'gruvbox-dark'
    | 'gruvbox-light'
    | 'kanagawa-dark'
    | 'moon-dark'
    | 'nord-dark'
    | 'rose-pine-dark'
    | 'rose-pine-light'
    | 'tokyo-night-dark'
    | 'tokyo-night-light'
    | 'wave-light'

export type ThemeNameLight = Extract<ThemeName, `${string}-light`>
export type ThemeNameDark = Extract<ThemeName, `${string}-dark`>

export type WaveformThemeName =
    | 'hifi'
    | 'bars-center'
    | 'bars-bottom'

export type WaveformTheme = {
    barWidth: number | undefined
    barRadius: number | undefined
    barGap: number | undefined
    barAlign: 'top' | 'bottom' | undefined
}
