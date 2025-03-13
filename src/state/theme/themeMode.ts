import type { ThemeMode } from '@app/types'
import { computed } from '@monstermann/signals'
import { $config } from '../app/config'

export const $themeMode = computed<ThemeMode>(() => $config().themeMode || 'dark')
