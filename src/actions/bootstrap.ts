import type { Config, Library } from '@app/types'
import { readJSON } from '@app/utils/fs/readJSON'
import { writeJSON } from '@app/utils/fs/writeJSON'
import { invalidateWindowShadows } from '@app/utils/invalidateWindowShadows'
import { action } from '@app/utils/signals/action'
import { changeEffect } from '@app/utils/signals/changeEffect'
import { checkForUpdates, periodicallyCheckForUpdates } from '@app/utils/updater'
import { batch } from '@preact/signals-react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { BaseDirectory } from '@tauri-apps/plugin-fs'
import pDebounce from 'p-debounce'
import { $config, $didLoadConfig, $playlists, $tracks, audio } from '../state/state'
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

let didBootstrap = false

export const bootstrap = action(async () => {
    if (didBootstrap) return
    didBootstrap = true

    audio.addEventListener('play', onAudioPlay)
    audio.addEventListener('pause', onAudioPause)
    audio.addEventListener('ended', onAudioEnded)
    audio.addEventListener('timeupdate', onAudioChangePosition)
    audio.addEventListener('volumechange', onAudioChangeVolume)
    audio.addEventListener('durationchange', onAudioChangeDuration)

    navigator.mediaSession.setActionHandler('play', resumePlayback)
    navigator.mediaSession.setActionHandler('pause', pausePlayback)
    navigator.mediaSession.setActionHandler('stop', stopPlayback)
    navigator.mediaSession.setActionHandler('previoustrack', playPrev)
    navigator.mediaSession.setActionHandler('nexttrack', playNext)

    getCurrentWindow().onFocusChanged((event) => {
        if (!event.payload) return
        invalidateWindowShadows()
    })

    const config = await readJSON<Config>('config.json', { baseDir: BaseDirectory.AppData })
    const saveConfig = pDebounce((config: Config) => writeJSON('config.json', config, { baseDir: BaseDirectory.AppData }), 100)

    const library = await readJSON<Library>('library.json', { baseDir: BaseDirectory.AppData })
    const saveLibrary = pDebounce((library: Library) => writeJSON('library.json', library, { baseDir: BaseDirectory.AppData }), 1000)

    batch(() => {
        $config.set(config ?? {})
        $tracks.set(library?.tracks ?? [])
        $playlists.set(library?.playlists ?? [])
        $didLoadConfig.set(true)
    })

    changeEffect(() => $config.value, saveConfig)
    changeEffect(() => ({ tracks: $tracks.value, playlists: $playlists.value }), saveLibrary)

    setTimeout(() => getCurrentWindow().show(), 100)

    syncLibrary()
    checkForUpdates()
    periodicallyCheckForUpdates()
})
