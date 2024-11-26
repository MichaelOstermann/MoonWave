import type { LSMState } from '../types'

export function isFirstSelection<T>(state: LSMState<T>, selectable: T): boolean {
    return state.selected.at(0) === state.getKey(selectable)
}
