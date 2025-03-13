import { action } from '@monstermann/signals'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const minimize = action(() => {
    getCurrentWindow().minimize()
})
