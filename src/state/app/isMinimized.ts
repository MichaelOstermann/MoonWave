import { signal } from '@monstermann/signals'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const $isMinimized = signal(false)

const tauri = getCurrentWindow()
tauri.onFocusChanged(async () => {
    $isMinimized.set(await tauri.isMinimized())
})
