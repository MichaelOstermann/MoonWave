import type { WaveformTheme } from '@app/types'
import { waveformThemes } from '@app/themes/waveforms'
import { computed } from '@app/utils/signals/computed'
import { $config } from './config'

export const $waveformTheme = computed<WaveformTheme>(() => {
    return waveformThemes[$config().waveformTheme || 'soundcloud']
})
