import type { LSM } from "./types"

export function hasSingleSelection<T>(state: LSM<T>): boolean {
    return state.selected.length === 0
}
