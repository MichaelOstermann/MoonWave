import type { LSM } from "../types"

export function cached<T, U>(state: LSM<T>, key: symbol, fn: () => U): U {
    return state.cache[key] ??= fn() as any
}
