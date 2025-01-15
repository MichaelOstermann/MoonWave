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

export type Track = {
    id: string
    mimetype: string
    addedAt: number
    path: string
    filehash: string
    audiohash: string
    title: string
    album: string
    artist: string
    duration: number
    year?: number
    trackNr?: number
    diskNr?: number
}

export type Playlist = {
    id: string
    title: string
    trackIds: string[]
    mode?: Mode
}

export type Library = {
    tracks: Track[]
    playlists: Playlist[]
}

export type Config = {
    sidebarWidth?: number
    libraryMode?: Mode
    recentlyAddedMode?: Mode
    unsortedMode?: Mode
    themeMode?: ThemeMode
    darkThemeName?: ThemeName
    lightThemeName?: ThemeName
    waveformTheme?: WaveformThemeName
}

export type ThemeMode =
    | 'light'
    | 'dark'
    | 'system'

export type ThemeName =
    | 'moonwave'

export type WaveformThemeName =
    | 'default'
    | 'soundcloud'

export type WaveformTheme = {
    barWidth: number | undefined
    barRadius: number | undefined
    barGap: number | undefined
    barAlign: 'top' | 'bottom' | undefined
}
