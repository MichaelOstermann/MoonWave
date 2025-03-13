import type { WaveformTheme, WaveformThemeName } from '@app/types'

export const waveformThemes = {
    'bars-center': {
        barWidth: 2,
        barRadius: undefined,
        barGap: 1,
        barAlign: undefined,
    },
    'bars-bottom': {
        barWidth: 2,
        barRadius: undefined,
        barGap: 1,
        barAlign: 'bottom',
    },
    'hifi': {
        barWidth: undefined,
        barRadius: undefined,
        barGap: undefined,
        barAlign: undefined,
    },
} satisfies Record<WaveformThemeName, WaveformTheme>
