import { memo } from "@monstermann/signals"
import { Tracks } from "."

export const $unsortedCount = memo(() => Tracks.$unsortedIds().size)
