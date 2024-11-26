import type { LSMState } from '../types'
import { getSelectableKeys } from '../internals/getSelectableKeys'

export function getSelectionPosition<T>(state: LSMState<T>, selectable: T): number {
    return getSelectableKeys(state).indexOf(state.getKey(selectable))
}
