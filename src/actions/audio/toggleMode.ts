import type { Mode } from "#features/Playback"
import { Playback } from "#features/Playback"
import { match } from "@monstermann/fn"
import { action } from "@monstermann/signals"
import { setMode } from "./setMode"

export const toggleMode = action(() => {
    const mode = match(Playback.$mode())
        .returnType<Mode>()
        .case("SHUFFLE", "REPEAT")
        .case("REPEAT", "SINGLE")
        .case("SINGLE", "SHUFFLE")
        .orThrow()

    setMode(mode)
})
