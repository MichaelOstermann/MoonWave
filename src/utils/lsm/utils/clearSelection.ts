import type { LSMState } from '../types'

export function clearSelection<T>(state: LSMState<T>): LSMState<T> {
    if (state.selected.length === 0) return state
    return { ...state, selected: [], anchors: new Set(), cache: {} }
}
