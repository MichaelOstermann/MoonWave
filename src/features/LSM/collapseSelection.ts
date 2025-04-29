import type { LSM } from "./types"
import { getSelectable } from "./getSelectable"
import { getAnchorKey } from "./internals/getAnchorKey"
import { selectOne } from "./selectOne"

export function collapseSelection<T>(state: LSM<T>): LSM<T> {
    const key = getAnchorKey(state)
    if (key === undefined) return state
    return selectOne(state, getSelectable(state, key)!)
}
