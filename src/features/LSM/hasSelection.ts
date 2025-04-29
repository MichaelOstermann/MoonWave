import type { LSM } from "./types"

export function hasSelection<T>(state: LSM<T>): boolean {
    return state.selected.length > 0
}
