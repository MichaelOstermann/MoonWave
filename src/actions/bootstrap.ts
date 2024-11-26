import { invalidateWindowShadows } from '@app/utils/invalidateWindowShadows'
import { loadLibrary } from '@app/utils/loadLibrary'
import { action } from '@app/utils/signals/action'
import { checkForUpdates, periodicallyCheckForUpdates } from '@app/utils/updater'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { audio } from '../state/state'
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

    await loadLibrary()

    setTimeout(() => getCurrentWindow().show(), 100)

    syncLibrary()
    checkForUpdates()
    periodicallyCheckForUpdates()
})
