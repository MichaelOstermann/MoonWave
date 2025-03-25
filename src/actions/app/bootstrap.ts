import type { Config, Library } from '@app/types'
import { $config } from '@app/state/app/config'
import { $didLoadLibrary } from '@app/state/app/didLoadLibrary'
import { $homeDir } from '@app/state/app/homeDir'
import { $isFocused } from '@app/state/app/isFocused'
import { $isMinimized } from '@app/state/app/isMinimized'
import { audio } from '@app/state/audio/audio'
import { $playlists } from '@app/state/playlists/playlists'
import { $tracks } from '@app/state/tracks/tracks'
import { sleep } from '@app/utils/data/sleep'
import { readJSON } from '@app/utils/fs/readJSON'
import { writeJSON } from '@app/utils/fs/writeJSON'
import { checkForUpdates, periodicallyCheckForUpdates } from '@app/utils/updater'
import { action, batch, onChange, onEvent, onKeyDown, onMediaSessionNextTrack, onMediaSessionPause, onMediaSessionPlay, onMediaSessionPreviousTrack, onMediaSessionStop } from '@monstermann/signals'
import { homeDir } from '@tauri-apps/api/path'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { BaseDirectory } from '@tauri-apps/plugin-fs'
import pDebounce from 'p-debounce'
import { onAudioChangeDuration } from '../audio/onAudioChangeDuration'
import { onAudioChangePosition } from '../audio/onAudioChangePosition'
import { onAudioChangeVolume } from '../audio/onAudioChangeVolume'
import { onAudioEnded } from '../audio/onAudioEnded'
import { onAudioPause } from '../audio/onAudioPause'
import { onAudioPlay } from '../audio/onAudioPlay'
import { pausePlayback } from '../audio/pausePlayback'
import { playNext } from '../audio/playNext'
import { playPrev } from '../audio/playPrev'
import { resumePlayback } from '../audio/resumePlayback'
import { stopPlayback } from '../audio/stopPlayback'
import { syncLibrary } from './syncLibrary'
import { triggerHotkey } from './triggerHotkey'

let didBootstrap = false
const saveConfig = pDebounce((config: Config) => writeJSON('config.json', config, { baseDir: BaseDirectory.AppData }), 1000)
const saveLibrary = pDebounce((library: Library) => writeJSON('library.json', library, { baseDir: BaseDirectory.AppData }), 1000)

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

    const [
        config,
        library,
        homePath,
        isFocused,
        isMinimized,
    ] = await Promise.all([
        readJSON<Config>('config.json', { baseDir: BaseDirectory.AppData }),
        readJSON<Library>('library.json', { baseDir: BaseDirectory.AppData }),
        homeDir(),
        tauri.isFocused(),
        tauri.isMinimized(),
    ])

    batch(() => {
        $config.set(config ?? {})
        $tracks.set(library?.tracks ?? [])
        $playlists.set(library?.playlists ?? [])
        $homeDir.set(homePath)
        $isFocused.set(isFocused)
        $isMinimized.set(isMinimized)
        $didLoadLibrary.set(true)
    })

    if (import.meta.env.PROD) {
        onChange($config, saveConfig)
        onChange(() => ({ tracks: $tracks(), playlists: $playlists() }), saveLibrary)
        syncLibrary()
    }

    await sleep(100)
    await getCurrentWindow().show()

    if (import.meta.env.PROD) {
        checkForUpdates()
        periodicallyCheckForUpdates()
    }
})
