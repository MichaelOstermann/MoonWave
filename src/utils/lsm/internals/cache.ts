import type { LSMState } from '../types'

export function cached<T, U>(state: LSMState<T>, key: symbol, fn: () => U): U {
    return state.cache[key] ??= fn() as any
}
