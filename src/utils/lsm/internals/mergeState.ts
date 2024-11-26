import type { LSMState } from '../types'

export function mergeState<T>(state: LSMState<T>, update: Partial<LSMState<T>>): LSMState<T> {
    for (const key in update) {
        const k = key as keyof LSMState<T>
        if (update[k] === state[k]) continue
        return { ...state, ...update, cache: {} }
    }
    return state
}
