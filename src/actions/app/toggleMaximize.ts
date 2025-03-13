import { action } from '@monstermann/signals'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const toggleMaximize = action(() => {
    getCurrentWindow().toggleMaximize()
})
