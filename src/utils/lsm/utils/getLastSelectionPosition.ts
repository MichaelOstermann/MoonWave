import type { LSMState } from '../types'
import { getSelectableKeys } from '../internals/getSelectableKeys'

export function getLastSelectionPosition<T>(state: LSMState<T>): number {
    const key = state.selected.at(-1)
    if (key === undefined) return -1
    return getSelectableKeys(state).indexOf(key)
}
