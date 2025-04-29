import type { LSM } from "./types"
import { getSelectable } from "./getSelectable"

export function getNthSelection<T>(state: LSM<T>, nth: number): T | undefined {
    const key = state.selected.at(nth)
    if (key === undefined) return undefined
    return getSelectable(state, key)
}
