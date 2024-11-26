import { action } from '@app/utils/signals/action'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const minimize = action(() => {
    getCurrentWindow().minimize()
})
