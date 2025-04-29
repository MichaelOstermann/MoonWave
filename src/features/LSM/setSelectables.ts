import type { LSM } from "./types"
import { Array } from "@monstermann/fn"
import { mergeState } from "./internals/mergeState"
import { normalize } from "./internals/normalize"

export function setSelectables<T>(state: LSM<T>, selectables: readonly T[]): LSM<T> {
    if (Array.isShallowEqual(state.selectables, selectables)) return state
    state = mergeState(state, { selectables })
    return normalize(state)
}
