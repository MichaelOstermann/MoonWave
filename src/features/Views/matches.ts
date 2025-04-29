import type { View } from "."
import { Object } from "@monstermann/fn"

export function matches<T extends View | undefined, U extends T>(target: T, source: U): target is U {
    if (!target && !source) return true
    if (!target || !source) return false
    return Object.isShallowEqual(target, source)
}
