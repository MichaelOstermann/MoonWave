import type { LSM } from "./types"
import { selectTo } from "./selectTo"

export function selectToTop<T>(state: LSM<T>): LSM<T> {
    const selectable = state.selectables.at(0)
    if (selectable === undefined) return state
    return selectTo(state, selectable)
}
