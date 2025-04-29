import type { LSM } from "./types"
import { getSelectedGroups } from "./internals/getSelectedGroups"

export function isFirstSelectionInGroup<T>(state: LSM<T>, selectable: T): boolean {
    const key = state.getKey(selectable)
    return getSelectedGroups(state).some(group => group.at(0) === key)
}
