import type { LSMState } from '../types'

export function hasSingleSelection<T>(state: LSMState<T>): boolean {
    return state.selected.length === 0
}
