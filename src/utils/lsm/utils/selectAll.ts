import type { LSMState } from '../types'
import { addSelected } from '../internals/addSelected'
import { getSelectableKeys } from '../internals/getSelectableKeys'
import { clearSelection } from './clearSelection'

export function selectAll<T>(state: LSMState<T>): LSMState<T> {
    if (state.selected.length === state.selectables.length) return state
    if (!state.selected.length) return state
    state = clearSelection(state)
    state = addSelected(state, getSelectableKeys(state))
    return state
}
