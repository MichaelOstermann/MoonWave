import type { WaveformThemeName } from '@app/types'
import { computed } from '@monstermann/signals'
import { $config } from '../app/config'

export const $waveformThemeName = computed<WaveformThemeName>(() => {
    return $config().waveformTheme || 'bars-bottom'
})
