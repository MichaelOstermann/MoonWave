import type { WaveformThemeName } from "#src/features/Theme"
import { Config } from "#features/Config"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const setWaveformTheme = action((waveformTheme: WaveformThemeName) => {
    Config.$config(Object.merge({ waveformTheme }))
})
