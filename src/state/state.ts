import type { Config, FocusedView, Mode, Playlist, SidebarItem, ThemeName, Track, View, WaveformTheme } from '@app/types'
import type WaveSurfer from 'wavesurfer.js'
import { waveformThemes } from '@app/themes/waveforms'
import { entriesEqual } from '@app/utils/data/entriesEqual'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { map } from '@app/utils/data/map'
import { getTracksForLibrary } from '@app/utils/getTracksForLibrary'
import { getTracksForPlaylist } from '@app/utils/getTracksForPlaylist'
import { getTracksForRecentlyAdded } from '@app/utils/getTracksForRecentlyAdded'
import { getTracksForUnsorted } from '@app/utils/getTracksForUnsorted'
import { clearSelection } from '@app/utils/lsm/utils/clearSelection'
import { createLSM } from '@app/utils/lsm/utils/createLSM'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { hasSelection } from '@app/utils/lsm/utils/hasSelection'
import { selectOne } from '@app/utils/lsm/utils/selectOne'
import { setSelectables } from '@app/utils/lsm/utils/setSelectables'
import { removePlaylistTracks } from '@app/utils/playlist/removePlaylistTracks'
import { changeEffect } from '@app/utils/signals/changeEffect'
import { computed } from '@app/utils/signals/computed'
import { effect } from '@app/utils/signals/effect'
import { indexSignalBy } from '@app/utils/signals/indexSignalBy'
import { signal } from '@app/utils/signals/signal'
import { deleteWaveform } from '@app/utils/waveform/deleteWaveform'
import { batch } from '@preact/signals-core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { shallowEqualObjects } from 'shallow-equal'
import { match } from 'ts-pattern'

// Library
export const $config = signal<Config>({})
export const $tracks = signal<Track[]>([])
export const $playlists = signal<Playlist[]>([])

// Indices
export const $tracksById = indexSignalBy($tracks, t => t.id)
export const $tracksByFilehash = indexSignalBy($tracks, t => t.filehash)
export const $tracksByAudiohash = indexSignalBy($tracks, t => t.audiohash)
export const $playlistsById = indexSignalBy($playlists, p => p.id)

// Audio
export const audio = new Audio()
export const $muted = signal(false)
export const $playing = signal(false)
export const $volume = signal<number>(1)
export const $loadedAudioMetadata = signal(false)
export const $currentTrackDuration = signal(0)
export const $currentTrackPosition = signal(0)
export const $waveformPeaks = signal<number[][]>([])

// Waveform
export const $wavesurfer = signal<WaveSurfer>(null)
export const $waveformWaveColor = signal<string>(undefined)
export const $waveformProgressColor = signal<string>(undefined)

// Sync
export const $syncing = signal(false)
export const $syncGoal = signal(0)
export const $syncProgress = signal(0)

// History
export const $playedTrackIds = signal<string[]>([])
export const $prevPlayedTrackIds = signal<string[]>([])
export const $nextPlayedTrackIds = signal<string[]>([])

// Theme
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
export const $themeModeSystem = signal<'light' | 'dark'>(mediaQuery.matches ? 'dark' : 'light')
mediaQuery.addEventListener('change', event => $themeModeSystem.set(event.matches ? 'dark' : 'light'))

// Client State
export const $didLoadConfig = signal(false)
export const $playingView = signal<View>(undefined, { equals: shallowEqualObjects })
export const $focusedView = signal<FocusedView>('SIDEBAR')
export const $playingTrackId = signal<string>(undefined)
export const $tracksFilter = signal('')
export const $editingPlaylistId = signal<string>(null)
export const $mouseX = signal(0)
export const $mouseY = signal(0)
export const $tracksLSM = signal(createLSM<string>())
export const $sidebarLSM = signal(createLSM<View>({
    muliselection: false,
    getKey: view => 'value' in view
        ? `${view.name}-${view.value}`
        : view.name,
}))

// Drag & Drop
export const $isDraggingTracks = signal(false)
export const $draggingPlaylistIds = signal<string[]>([])
export const $isDraggingPlaylists = computed(() => $draggingPlaylistIds().length > 0)
export const $dropPlaylistId = signal<string>(null)
export const $dropPlaylistElement = signal<HTMLElement>(null)
export const $dropPlaylistBounds = computed(() => $dropPlaylistElement()?.getBoundingClientRect())
export const $dropPlaylistSide = computed<'above' | 'below'>(() => {
    const bounds = $dropPlaylistBounds()
    if (!bounds) return 'below'
    const mouseY = $mouseY()
    return mouseY < bounds.top + bounds.height / 2 ? 'above' : 'below'
})

// Computeds

export const $view = computed<View>(() => {
    return getSelections($sidebarLSM.value).at(0) ?? { name: 'LIBRARY' }
}, { equals: shallowEqualObjects })

export const $sortedTrackIds = computed(() => {
    return $playlists().reduce((acc, p) => {
        return p.trackIds.reduce((acc, tid) => acc.add(tid), acc)
    }, new Set<string>())
}, { equals: entriesEqual })

export const $unsortedTrackIds = computed(() => {
    const sortedTrackIds = $sortedTrackIds()
    return $tracks().reduce((acc, t) => {
        if (!sortedTrackIds.has(t.id)) acc.add(t.id)
        return acc
    }, new Set<string>())
}, { equals: entriesEqual })

export const $unsortedTracksCount = computed(() => $unsortedTrackIds().size)

export const $playlistColor = computed(() => {
    const view = $view()
    if (view.name !== 'PLAYLIST') return undefined
    return $playlistsById(view.value)()?.color
})

export const $playingMode = computed<Mode>(() => {
    const view = $playingView.value ?? $view.value
    switch (view.name) {
        case 'LIBRARY': return $config.value.libraryMode ?? 'SHUFFLE'
        case 'RECENTLY_ADDED': return $config.value.recentlyAddedMode ?? 'SHUFFLE'
        case 'UNSORTED': return $config.value.unsortedMode ?? 'SHUFFLE'
        case 'PLAYLIST': return $playlistsById(view.value).value?.mode ?? 'SHUFFLE'
    }
})

export const $sidebarItems = computed<SidebarItem[]>(() => {
    return [
        { name: 'SECTION', value: 'Home' },
        { name: 'LIBRARY' },
        { name: 'RECENTLY_ADDED' },
        { name: 'UNSORTED' },
        { name: 'SECTION', value: 'Playlists' },
        ...$playlists.value.map<View>(p => ({ name: 'PLAYLIST', value: p.id })),
    ]
})

export const $viewingTracks = computed<Track[]>(() => {
    const view = $view.value
    switch (view.name) {
        case 'LIBRARY': return getTracksForLibrary({ applyFilter: true })
        case 'RECENTLY_ADDED': return getTracksForRecentlyAdded({ applyFilter: true })
        case 'UNSORTED': return getTracksForUnsorted({ applyFilter: true })
        case 'PLAYLIST': return getTracksForPlaylist(view.value, { applyFilter: true })
    }
})

export const $playingTracks = computed<Track[]>(() => {
    const view = $playingView.value ?? $view.value
    switch (view.name) {
        case 'LIBRARY': return getTracksForLibrary({ applyFilter: true })
        case 'RECENTLY_ADDED': return getTracksForRecentlyAdded({ applyFilter: true })
        case 'UNSORTED': return getTracksForUnsorted({ applyFilter: true })
        case 'PLAYLIST': return getTracksForPlaylist(view.value, { applyFilter: true })
    }
})

export const $waveformTheme = computed<WaveformTheme>(() => {
    return waveformThemes[$config.value.waveformTheme || 'soundcloud']
})

export const $hasTrack = computed<boolean>(() => Boolean($playingTrackId.value || $playingTracks.value.length > 0))
export const $hasPrevTrack = computed<boolean>(() => Boolean($playingTrackId.value || $prevPlayedTrackIds.value.length > 0))
export const $hasNextTrack = computed<boolean>(() => Boolean($playingTrackId.value && $playingTracks.value.length > 0))

// Effects

document.addEventListener('pointermove', evt => batch(() => {
    $mouseX.set(evt.clientX)
    $mouseY.set(evt.clientY)
}), { passive: true })

effect((prev: string[] = []) => {
    if (!$didLoadConfig.value) return prev

    const themeModeSystem = $themeModeSystem.value
    const themeModeUser = $config.value.themeMode || 'system'

    const themeMode = themeModeUser === 'system'
        ? themeModeSystem
        : themeModeUser

    getCurrentWindow().setTheme(themeMode)

    const themeName = match(themeMode)
        .returnType<ThemeName>()
        .with('light', () => $config.value.lightThemeName || 'moonwave')
        .with('dark', () => $config.value.darkThemeName || 'moonwave')
        .exhaustive()

    const next = [`theme-${themeName}-${themeMode}`]
    for (const className of prev) document.body.classList.remove(className)
    for (const className of next) document.body.classList.add(className)
    const style = getComputedStyle(document.body)

    $waveformWaveColor.set(style.getPropertyValue('--waveform'))

    const playlistColor = $playlistColor()?.value
    const progressProperty = playlistColor ? `--accent-${playlistColor}` : '--accent'
    $waveformProgressColor.set(style.getPropertyValue(progressProperty))

    return next
})

changeEffect(() => $view.value, () => $tracksLSM.map(clearSelection))
changeEffect(() => $tracksFilter.value, () => $tracksLSM.map(clearSelection))

effect(() => {
    if (hasSelection($tracksLSM.value)) return
    $isDraggingTracks.set(false)
})

effect(() => {
    if ($isDraggingTracks()) return
    if ($isDraggingPlaylists()) return
    $dropPlaylistId.set(null)
})

effect(() => {
    if ($dropPlaylistId()) return
    $dropPlaylistElement.set(null)
})

effect(() => {
    $wavesurfer.value?.setTime($currentTrackPosition.value)
})

changeEffect(() => $playingView.value, () => {
    $prevPlayedTrackIds.set([])
    $nextPlayedTrackIds.set([])
})

effect(() => {
    const trackId = $playingTrackId.value
    if (!trackId) return
    if ($playedTrackIds.peek().includes(trackId)) return
    $playedTrackIds.map(tids => [...tids, trackId])
})

effect(() => {
    const trackId = $playingTrackId.value
    const track = $tracksById(trackId).value
    if (!track) return

    audio.title = [track.title, track.artist, track.album]
        .filter(Boolean)
        .join(' — ')

    navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
    })
})

effect(() => {
    const trackId = $playingTrackId.value
    const track = $tracksById(trackId).value
    if (track) return

    audio.title = ''
    navigator.mediaSession.metadata = null
})

effect(() => {
    const selectables = $viewingTracks.value.map(t => t.id)
    $tracksLSM.map(lsm => setSelectables(lsm, selectables))
})

effect(() => {
    const selectables = $sidebarItems.value.filter(i => i.name !== 'SECTION')
    $sidebarLSM.map(lsm => setSelectables(lsm, selectables))
})

effect(() => {
    if (hasSelection($sidebarLSM.value)) return
    $sidebarLSM.map(lsm => selectOne(lsm, { name: 'LIBRARY' }))
})

changeEffect(() => $tracks.value, (tracksAfter, tracksBefore) => {
    const trackIdsBefore = new Set(tracksBefore.map(t => t.id))
    const trackIdsAfter = new Set(tracksAfter.map(t => t.id))
    const removedTrackIds = trackIdsBefore.difference(trackIdsAfter)
    if (removedTrackIds.size === 0) return

    $playedTrackIds.map(findAndRemoveAll(tid => removedTrackIds.has(tid)))
    $prevPlayedTrackIds.map(findAndRemoveAll(tid => removedTrackIds.has(tid)))
    $nextPlayedTrackIds.map(findAndRemoveAll(tid => removedTrackIds.has(tid)))
    $playlists.map(map(p => removePlaylistTracks(p, Array.from(removedTrackIds))))

    removedTrackIds.forEach(tid => deleteWaveform(tid))

    if ($playingTrackId.value && removedTrackIds.has($playingTrackId.value)) {
        $playingTrackId.set(undefined)
        audio.pause()
        audio.currentTime = 0
    }
})

changeEffect(() => $playlists.value, (playlistsAfter, playlistsBefore) => {
    const playlistIdsBefore = new Set(playlistsBefore.map(t => t.id))
    const playlistIdsAfter = new Set(playlistsAfter.map(t => t.id))
    const removedPlaylistIds = playlistIdsBefore.difference(playlistIdsAfter)
    if (removedPlaylistIds.size === 0) return

    if ($dropPlaylistId.value && removedPlaylistIds.has($dropPlaylistId.value))
        $dropPlaylistId.set(null)

    if ($editingPlaylistId.value && removedPlaylistIds.has($editingPlaylistId.value))
        $editingPlaylistId.set(null)

    if ($playingView.value?.name === 'PLAYLIST' && removedPlaylistIds.has($playingView.value.value))
        $playingView.set(undefined)
})
