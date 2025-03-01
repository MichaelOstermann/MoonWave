import type { ThemeMode } from '@app/types'
import { $config } from '@app/state/config'
import { merge } from '@app/utils/data/merge'
import { action } from '@app/utils/signals/action'

export const setThemeMode = action((themeMode: ThemeMode) => {
    $config.map(merge({ themeMode }))
})
