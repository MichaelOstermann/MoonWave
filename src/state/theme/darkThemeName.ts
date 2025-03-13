import type { ThemeNameDark } from '@app/types'
import { computed } from '@monstermann/signals'
import { $config } from '../app/config'

export const $darkThemeName = computed<ThemeNameDark>(() => $config().darkThemeName || 'moon-dark')
