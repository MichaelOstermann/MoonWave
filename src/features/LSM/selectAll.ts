import type { LSM } from "./types"
import { clearSelection } from "./clearSelection"
import { addSelected } from "./internals/addSelected"
import { getSelectableKeys } from "./internals/getSelectableKeys"

export function selectAll<T>(state: LSM<T>): LSM<T> {
    if (state.selected.length === state.selectables.length) return state
    if (!state.selected.length) return state
    state = clearSelection(state)
    state = addSelected(state, getSelectableKeys(state))
    return state
}
