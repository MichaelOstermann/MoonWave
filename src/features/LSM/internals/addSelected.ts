import type { LSM } from "../types"
import { Array } from "@monstermann/fn"
import { mergeState } from "./mergeState"

export function addSelected<T>(state: LSM<T>, keys: string[]): LSM<T> {
    const slice = state.selected.slice(-keys.length)
    if (Array.isShallowEqual(slice, keys)) return state
    return mergeState(state, {
        selected: state.selected.filter(k => !keys.includes(k)).concat(keys),
    })
}
