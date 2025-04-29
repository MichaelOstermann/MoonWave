import type { LSM } from "./types"

export function hasNoSelection<T>(state: LSM<T>): boolean {
    return state.selected.length === 0
}
