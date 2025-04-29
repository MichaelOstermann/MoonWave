import type { LSM } from "./types"
import { clearSelection } from "./clearSelection"
import { addAnchors } from "./internals/addAnchors"
import { addSelected } from "./internals/addSelected"
import { normalize } from "./internals/normalize"

export function selectOne<T>(state: LSM<T>, selectable: T): LSM<T> {
    const key = state.getKey(selectable)
    if (state.selected.length === 1 && state.selected.includes(key)) return state
    state = clearSelection(state)
    state = addSelected(state, [key])
    state = addAnchors(state, [key])
    return normalize(state)
}
