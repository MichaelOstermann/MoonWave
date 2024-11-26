import { action } from '@app/utils/signals/action'
import { exit as exitApp } from '@tauri-apps/plugin-process'

export const exit = action(() => {
    exitApp()
})
