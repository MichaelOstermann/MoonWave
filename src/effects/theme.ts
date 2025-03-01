import type { ThemeName } from '@app/types'
import { $config } from '@app/state/config'
import { $didLoadLibrary } from '@app/state/didLoadLibrary'
import { $playlistColor } from '@app/state/playlistColor'
import { $waveformProgressColor } from '@app/state/waveformProgressColor'
import { $waveformWaveColor } from '@app/state/waveformWaveColor'
import { $prefersDarkMode } from '@app/utils/signals/browser'
import { effect } from '@app/utils/signals/effect'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { match } from 'ts-pattern'

effect(() => {
    if (!$didLoadLibrary()) return

    const themeModeSystem = $prefersDarkMode() ? 'dark' : 'light'
    const themeModeUser = $config().themeMode || 'system'

    const themeMode = themeModeUser === 'system'
        ? themeModeSystem
        : themeModeUser

    getCurrentWindow().setTheme(themeMode)

    const themeName = match(themeMode)
        .returnType<ThemeName>()
        .with('light', () => $config().lightThemeName || 'moonwave')
        .with('dark', () => $config().darkThemeName || 'moonwave')
        .exhaustive()

    document.body.setAttribute('data-theme', `${themeName}-${themeMode}`)

    const style = getComputedStyle(document.body)
    const playlistColor = $playlistColor()?.value
    const progressProperty = playlistColor ? `--accent-${playlistColor}` : '--accent'

    $waveformWaveColor.set(style.getPropertyValue('--waveform'))
    $waveformProgressColor.set(style.getPropertyValue(progressProperty))
})
