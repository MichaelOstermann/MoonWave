import type { LSM } from "../types"
import { getAnchorKey } from "./getAnchorKey"
import { getSelectableKeys } from "./getSelectableKeys"

export function getAnchorPosition<T>(state: LSM<T>): number {
    const key = getAnchorKey(state)
    if (key === undefined) return -1
    return getSelectableKeys(state).indexOf(key)
}
