import { Array } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { Playback } from "."

export const $trackIds = memo<string[]>(() => Playback.$tracks().map(t => t.id), {
    equals: Array.isShallowEqual,
})
