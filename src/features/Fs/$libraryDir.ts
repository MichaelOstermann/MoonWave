import { memo } from "@monstermann/signals"
import { $audioDir } from "./$audioDir"

export const $libraryDir = memo(() => `${$audioDir()}/MoonWave`)
