import type { LSMState } from '../types'

export function hasMultipleSelections<T>(state: LSMState<T>): boolean {
    return state.selected.length > 1
}
