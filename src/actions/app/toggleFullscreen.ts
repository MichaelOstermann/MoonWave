import { action } from '@monstermann/signals'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const toggleFullscreen = action(async () => {
    getCurrentWindow().setFullscreen(!(await getCurrentWindow().isFullscreen()))
})
