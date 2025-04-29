import type { LSM } from "./types"

export function isFirstSelection<T>(state: LSM<T>, selectable: T): boolean {
    return state.selected.at(0) === state.getKey(selectable)
}
