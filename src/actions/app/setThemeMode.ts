import type { ThemeMode } from '@app/types'
import { $config } from '@app/state/app/config'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'

export const setThemeMode = action((themeMode: ThemeMode) => {
    $config.map(merge({ themeMode }))
})
