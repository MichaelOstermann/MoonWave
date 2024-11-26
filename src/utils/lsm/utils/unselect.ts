import type { LSMState } from '../types'
import { normalize } from '../internals/normalize'
import { removeSelected } from '../internals/removeSelected'

export function unselect<T>(state: LSMState<T>, selectable: T): LSMState<T> {
    state = removeSelected(state, [state.getKey(selectable)])
    return normalize(state)
}
