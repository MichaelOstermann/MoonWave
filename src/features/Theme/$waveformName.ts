import type { WaveformThemeName } from "."
import { Config } from "#features/Config"
import { memo } from "@monstermann/signals"

export const $waveformName = memo<WaveformThemeName>(() => {
    return Config.$config().waveformTheme || "bars-bottom"
})
