import type { LSM } from "./types"

export function hasMultipleSelections<T>(state: LSM<T>): boolean {
    return state.selected.length > 1
}
