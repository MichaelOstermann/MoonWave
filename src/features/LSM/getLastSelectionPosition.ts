import type { LSM } from "./types"
import { getSelectableKeys } from "./internals/getSelectableKeys"

export function getLastSelectionPosition<T>(state: LSM<T>): number {
    const key = state.selected.at(-1)
    if (key === undefined) return -1
    return getSelectableKeys(state).indexOf(key)
}
