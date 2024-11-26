import type { WaveformTheme, WaveformThemeName } from '@app/types'

export const waveformThemes = {
    default: {
        barWidth: undefined,
        barRadius: undefined,
        barGap: undefined,
        barAlign: undefined,
    },
    soundcloud: {
        barWidth: 2,
        barRadius: undefined,
        barGap: 1,
        barAlign: 'bottom',
    },
} satisfies Record<WaveformThemeName, WaveformTheme>
