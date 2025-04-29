import type { WaveformTheme } from "."
import { waveformThemes } from "#src/themes/waveforms"
import { memo } from "@monstermann/signals"
import { Theme } from "."

export const $waveform = memo<WaveformTheme>(() => {
    return waveformThemes[Theme.$waveformName()]
})
