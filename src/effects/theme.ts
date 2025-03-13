import { $didLoadLibrary } from '@app/state/app/didLoadLibrary'
import { $viewingPlaylistColor } from '@app/state/playlists/viewingPlaylistColor'
import { $accent } from '@app/state/theme/accent'
import { $themeMode } from '@app/state/theme/themeMode'
import { $themeName } from '@app/state/theme/themeName'
import { $waveformProgressColor } from '@app/state/theme/waveformProgressColor'
import { $waveformWaveColor } from '@app/state/theme/waveformWaveColor'
import { effect } from '@monstermann/signals'
import { getCurrentWindow } from '@tauri-apps/api/window'

effect(() => {
    if (!$didLoadLibrary()) return

    const themeMode = $themeMode()
    const themeName = $themeName()

    document.body.setAttribute('data-mode', themeMode)
    document.body.setAttribute('data-theme', themeName)

    const style = getComputedStyle(document.body)
    const playlistColor = $viewingPlaylistColor()?.value
    const progressProperty = playlistColor ? `--accent-${playlistColor}` : '--accent'

    $accent.set(style.getPropertyValue('--accent'))
    $waveformWaveColor.set(style.getPropertyValue('--waveform'))
    $waveformProgressColor.set(style.getPropertyValue(progressProperty))
    getCurrentWindow().setTheme(themeMode)
})
