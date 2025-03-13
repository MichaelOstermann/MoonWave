import { action } from '@monstermann/signals'
import { exit as exitApp } from '@tauri-apps/plugin-process'

export const exit = action(() => {
    exitApp()
})
