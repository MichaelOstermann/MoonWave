import type { ThemeNameLight } from '@app/types'
import { $config } from '@app/state/app/config'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'

export const setLightTheme = action((lightThemeName: ThemeNameLight) => {
    $config.map(merge({ lightThemeName }))
})
