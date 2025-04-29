import type { LSM } from "./types"
import { addAnchors } from "./internals/addAnchors"
import { addSelected } from "./internals/addSelected"
import { normalize } from "./internals/normalize"

export function select<T>(state: LSM<T>, selectable: T): LSM<T> {
    const key = state.getKey(selectable)
    state = addSelected(state, [key])
    state = addAnchors(state, [key])
    return normalize(state)
}
