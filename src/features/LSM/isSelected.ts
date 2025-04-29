import type { LSM } from "./types"

export function isSelected<T>(state: LSM<T>, selectable: T): boolean {
    return state.selected.includes(state.getKey(selectable))
}
