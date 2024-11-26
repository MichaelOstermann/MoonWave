import type { LSMState } from '../types'

export function hasSelection<T>(state: LSMState<T>): boolean {
    return state.selected.length > 0
}
