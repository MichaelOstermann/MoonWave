import type { Config, Library } from '@app/types'
import { audio } from '@app/state/audio'
import { $config } from '@app/state/config'
import { $didLoadLibrary } from '@app/state/didLoadLibrary'
import { $isFocused } from '@app/state/isFocused'
import { $isMinimized } from '@app/state/isMinimized'
import { $playlists } from '@app/state/playlists'
import { $tracks } from '@app/state/tracks'
import { readJSON } from '@app/utils/fs/readJSON'
import { writeJSON } from '@app/utils/fs/writeJSON'
import { action } from '@app/utils/signals/action'
import { onKeyDown, onMediaSessionNextTrack, onMediaSessionPause, onMediaSessionPlay, onMediaSessionPreviousTrack, onMediaSessionStop } from '@app/utils/signals/browser'
import { changeEffect } from '@app/utils/signals/changeEffect'
import { onEvent } from '@app/utils/signals/onEvent'
import { checkForUpdates, periodicallyCheckForUpdates } from '@app/utils/updater'
import { batch } from '@preact/signals-core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { BaseDirectory } from '@tauri-apps/plugin-fs'
import pDebounce from 'p-debounce'
import { onAudioChangeDuration } from './onAudioChangeDuration'
import { onAudioChangePosition } from './onAudioChangePosition'
import { onAudioChangeVolume } from './onAudioChangeVolume'
import { onAudioEnded } from './onAudioEnded'
import { onAudioPause } from './onAudioPause'
import { onAudioPlay } from './onAudioPlay'
import { pausePlayback } from './pausePlayback'
import { playNext } from './playNext'
import { playPrev } from './playPrev'
import { resumePlayback } from './resumePlayback'
import { stopPlayback } from './stopPlayback'
import { syncLibrary } from './syncLibrary'
import { triggerHotkey } from './triggerHotkey'

let didBootstrap = false
const saveConfig = pDebounce((config: Config) => writeJSON('config.json', config, { baseDir: BaseDirectory.AppData }), 100)
const saveLibrary = pDebounce((library: Library) => writeJSON('library.json', library, { baseDir: BaseDirectory.AppData }), 100)

export const bootstrap = action(async () => {
    if (didBootstrap) return
    didBootstrap = true

    const tauri = getCurrentWindow()

    audio.addEventListener('play', onAudioPlay)
    audio.addEventListener('pause', onAudioPause)
    audio.addEventListener('ended', onAudioEnded)
    audio.addEventListener('timeupdate', onAudioChangePosition)
    audio.addEventListener('volumechange', onAudioChangeVolume)
    audio.addEventListener('durationchange', onAudioChangeDuration)

    onEvent(onKeyDown, triggerHotkey)
    onEvent(onMediaSessionPlay, resumePlayback)
    onEvent(onMediaSessionPause, pausePlayback)
    onEvent(onMediaSessionStop, stopPlayback)
    onEvent(onMediaSessionPreviousTrack, playPrev)
    onEvent(onMediaSessionNextTrack, playNext)

    const [config, library, isFocused, isMinimized] = await Promise.all([
        readJSON<Config>('config.json', { baseDir: BaseDirectory.AppData }),
        readJSON<Library>('library.json', { baseDir: BaseDirectory.AppData }),
        tauri.isFocused(),
        tauri.isMinimized(),
    ])

    batch(() => {
        $config.set(config ?? {})
        $tracks.set(library?.tracks ?? [])
        $playlists.set(library?.playlists ?? [])
        $isFocused.set(isFocused)
        $isMinimized.set(isMinimized)
        $didLoadLibrary.set(true)
    })

    if (import.meta.env.PROD) {
        changeEffect($config, saveConfig)
        changeEffect(() => ({ tracks: $tracks(), playlists: $playlists() }), saveLibrary)
        syncLibrary()
    }

    tauri.onFocusChanged(async () => {
        const [isFocused, isMinimized] = await Promise.all([
            tauri.isFocused(),
            tauri.isMinimized(),
        ])
        batch(() => {
            $isFocused.set(isFocused)
            $isMinimized.set(isMinimized)
        })
    })

    await sleep(100)
    await getCurrentWindow().show()

    if (import.meta.env.PROD) {
        checkForUpdates()
        periodicallyCheckForUpdates()
    }
})

function sleep(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration))
}
