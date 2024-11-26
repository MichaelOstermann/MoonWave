import type { LSMState } from '../types'
import { addAnchors } from '../internals/addAnchors'
import { addSelected } from '../internals/addSelected'
import { normalize } from '../internals/normalize'
import { clearSelection } from './clearSelection'

export function selectOne<T>(state: LSMState<T>, selectable: T): LSMState<T> {
    const key = state.getKey(selectable)
    if (state.selected.length === 1 && state.selected.includes(key)) return state
    state = clearSelection(state)
    state = addSelected(state, [key])
    state = addAnchors(state, [key])
    return normalize(state)
}
