import type { ThemeNameLight } from '@app/types'
import { computed } from '@monstermann/signals'
import { $config } from '../app/config'

export const $lightThemeName = computed<ThemeNameLight>(() => $config().lightThemeName || 'wave-light')
