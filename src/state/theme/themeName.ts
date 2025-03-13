import type { ThemeName } from '@app/types'
import { computed } from '@monstermann/signals'
import { $darkThemeName } from './darkThemeName'
import { $lightThemeName } from './lightThemeName'
import { $themeMode } from './themeMode'

export const $themeName = computed<ThemeName>(() => {
    return $themeMode() === 'light'
        ? $lightThemeName()
        : $darkThemeName()
})
