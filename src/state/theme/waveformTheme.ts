import type { WaveformTheme } from '@app/types'
import { waveformThemes } from '@app/themes/waveforms'
import { computed } from '@monstermann/signals'
import { $waveformThemeName } from './waveformThemeName'

export const $waveformTheme = computed<WaveformTheme>(() => {
    return waveformThemes[$waveformThemeName()]
})
