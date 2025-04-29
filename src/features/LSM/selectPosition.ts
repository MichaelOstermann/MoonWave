import type { LSM } from "./types"
import { selectOne } from "./selectOne"

export function selectPosition<T>(state: LSM<T>, position: number): LSM<T> {
    const selectable = state.selectables[position]
    if (!selectable) return state
    return selectOne(state, selectable)
}
