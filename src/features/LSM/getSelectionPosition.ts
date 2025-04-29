import type { LSM } from "./types"
import { getSelectableKeys } from "./internals/getSelectableKeys"

export function getSelectionPosition<T>(state: LSM<T>, selectable: T): number {
    return getSelectableKeys(state).indexOf(state.getKey(selectable))
}
