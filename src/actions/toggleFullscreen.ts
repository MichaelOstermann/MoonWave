import { action } from '@app/utils/signals/action'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const toggleFullscreen = action(async () => {
    getCurrentWindow().setFullscreen(!(await getCurrentWindow().isFullscreen()))
})
