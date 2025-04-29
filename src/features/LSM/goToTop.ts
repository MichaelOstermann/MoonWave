import type { LSM } from "./types"
import { selectOne } from "./selectOne"

export function goToTop<T>(state: LSM<T>): LSM<T> {
    const selectable = state.selectables.at(0)
    if (selectable === undefined) return state
    return selectOne(state, selectable)
}
