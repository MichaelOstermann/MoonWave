import type { WaveformThemeName } from '@app/types'
import { $config } from '@app/state/app/config'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'

export const setWaveformTheme = action((waveformTheme: WaveformThemeName) => {
    $config.map(merge({ waveformTheme }))
})
