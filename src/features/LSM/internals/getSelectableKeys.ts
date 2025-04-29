import type { LSM } from "../types"
import { cached } from "./cache"

const key = Symbol("selectableKeys")

export function getSelectableKeys<T>(state: LSM<T>): string[] {
    return cached(state, key, () => {
        return state.selectables.map(selectable => state.getKey(selectable))
    })
}
