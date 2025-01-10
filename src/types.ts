export type Mode =
    | 'SINGLE'
    | 'REPEAT'
    | 'SHUFFLE'

export type Sort = {
    by: 'TITLE' | 'ARTIST' | 'ALBUM' | 'DURATION'
    order: 'ASC' | 'DESC'
}

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
    addedAt: string
    path: string
    filehash: string
    audiohash: string
    title: string
    album: string
    artist: string
    duration: number
    date?: string
    trackNr?: number
    diskNr?: number
}

export type Playlist = {
    id: string
    addedAt: string
    title: string
    mode?: Mode
    sort?: Sort
}

export type PlaylistToTrack = {
    addedAt: string
    trackId: string
    playlistId: string
}

export type Config = {
    // TODO
    libraryPath?: string
    library?: {
        mode?: Mode
        sort?: Sort
    }
    recentlyAdded?: {
        mode?: Mode
        sort?: Sort
    }
    unsorted?: {
        mode?: Mode
        sort?: Sort
    }
    // TODO
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
