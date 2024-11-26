import type { LSMState } from '../types'
import { getSelectedGroups } from '../internals/getSelectedGroups'

export function isFirstSelectionInGroup<T>(state: LSMState<T>, selectable: T): boolean {
    const key = state.getKey(selectable)
    return getSelectedGroups(state).some(group => group.at(0) === key)
}
