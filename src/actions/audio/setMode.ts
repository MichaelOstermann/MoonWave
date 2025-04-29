import type { Mode } from "#src/features/Playback"
import { Config } from "#features/Config"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const setMode = action((mode: Mode) => {
    Config.$config(Object.merge({ mode }))
})
