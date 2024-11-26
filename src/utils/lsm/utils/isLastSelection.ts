import type { LSMState } from '../types'

export function isLastSelection<T>(state: LSMState<T>, selectable: T): boolean {
    return state.selected.at(-1) === state.getKey(selectable)
}
