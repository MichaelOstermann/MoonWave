import type { ThemeNameDark } from '@app/types'
import { $config } from '@app/state/app/config'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'

export const setDarkTheme = action((darkThemeName: ThemeNameDark) => {
    $config.map(merge({ darkThemeName }))
})
