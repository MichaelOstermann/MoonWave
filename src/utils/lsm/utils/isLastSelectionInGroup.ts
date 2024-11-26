import type { LSMState } from '../types'
import { getSelectedGroups } from '../internals/getSelectedGroups'

export function isLastSelectionInGroup<T>(state: LSMState<T>, selectable: T): boolean {
    const key = state.getKey(selectable)
    return getSelectedGroups(state).some(group => group.at(-1) === key)
}
