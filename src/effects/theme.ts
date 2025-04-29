import { App } from "#features/App"
import { Sidebar } from "#features/Sidebar"
import { Theme } from "#features/Theme"
import { effect } from "@monstermann/signals"
import { getCurrentWindow } from "@tauri-apps/api/window"

effect(() => {
    if (!App.$didLoadLibrary()) return

    const themeMode = Theme.$mode()
    const themeName = Theme.$name()

    document.body.setAttribute("data-mode", themeMode)
    document.body.setAttribute("data-theme", themeName)

    const style = getComputedStyle(document.body)
    const playlistColor = Sidebar.$playlistColor()?.value
    const progressProperty = playlistColor ? `--accent-${playlistColor}` : "--accent"

    Theme.$accent(style.getPropertyValue("--accent"))
    Theme.$waveformWaveColor(style.getPropertyValue("--waveform"))
    Theme.$waveformProgressColor(style.getPropertyValue(progressProperty))
    getCurrentWindow().setTheme(themeMode)
})
