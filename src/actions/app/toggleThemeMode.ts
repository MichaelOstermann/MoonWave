import { $config } from '@app/state/app/config'
import { $themeMode } from '@app/state/theme/themeMode'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'

export const toggleThemeMode = action(() => {
    const themeMode = $themeMode() === 'light' ? 'dark' : 'light'
    $config.map(merge({ themeMode }))
})
