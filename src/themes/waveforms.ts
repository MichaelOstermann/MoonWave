import type { WaveformTheme, WaveformThemeName } from "#src/features/Theme"

export const waveformThemes = {
    "bars-bottom": {
        barAlign: "bottom",
        barGap: 1,
        barRadius: undefined,
        barWidth: 2,
    },
    "bars-center": {
        barAlign: undefined,
        barGap: 1,
        barRadius: undefined,
        barWidth: 2,
    },
    "hifi": {
        barAlign: undefined,
        barGap: undefined,
        barRadius: undefined,
        barWidth: undefined,
    },
} satisfies Record<WaveformThemeName, WaveformTheme>
