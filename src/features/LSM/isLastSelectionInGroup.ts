import type { LSM } from "./types"
import { getSelectedGroups } from "./internals/getSelectedGroups"

export function isLastSelectionInGroup<T>(state: LSM<T>, selectable: T): boolean {
    const key = state.getKey(selectable)
    return getSelectedGroups(state).some(group => group.at(-1) === key)
}
