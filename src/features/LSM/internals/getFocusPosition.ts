import type { LSM } from "../types"
import { getFocusKey } from "./getFocusKey"
import { getSelectableKeys } from "./getSelectableKeys"

export function getFocusPosition<T>(state: LSM<T>): number {
    const key = getFocusKey(state)
    if (key === undefined) return -1
    return getSelectableKeys(state).indexOf(key)
}
