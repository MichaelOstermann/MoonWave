import type { LSM } from "./types"
import { normalize } from "./internals/normalize"
import { removeSelected } from "./internals/removeSelected"

export function unselect<T>(state: LSM<T>, selectable: T): LSM<T> {
    state = removeSelected(state, [state.getKey(selectable)])
    return normalize(state)
}
