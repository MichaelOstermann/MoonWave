import type { LSM } from "./types"

export function clearSelection<T>(state: LSM<T>): LSM<T> {
    if (state.selected.length === 0) return state
    return { ...state, anchors: new Set(), cache: {}, selected: [] }
}
