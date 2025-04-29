import type { LSM } from "../types"

export function mergeState<T>(state: LSM<T>, update: Partial<LSM<T>>): LSM<T> {
    for (const key in update) {
        const k = key as keyof LSM<T>
        if (update[k] === state[k]) continue
        return { ...state, ...update, cache: {} }
    }
    return state
}
