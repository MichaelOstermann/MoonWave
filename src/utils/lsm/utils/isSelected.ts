import type { LSMState } from '../types'

export function isSelected<T>(state: LSMState<T>, selectable: T): boolean {
    return state.selected.includes(state.getKey(selectable))
}
