import type { LSM } from "../types"
import { mergeState } from "./mergeState"

export function removeAnchors<T>(state: LSM<T>, keys: string[]): LSM<T> {
    keys = keys.filter(key => state.anchors.has(key))
    if (!keys.length) return state
    const anchors = new Set(state.anchors)
    keys.forEach(key => anchors.delete(key))
    return mergeState(state, { anchors })
}
