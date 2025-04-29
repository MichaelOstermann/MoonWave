import type { LSM } from "./types"

export function isLastSelection<T>(state: LSM<T>, selectable: T): boolean {
    return state.selected.at(-1) === state.getKey(selectable)
}
