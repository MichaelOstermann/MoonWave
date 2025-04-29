import type { LSM } from "./types"
import { isSelected } from "./isSelected"
import { select } from "./select"
import { unselect } from "./unselect"

export function toggleSelect<T>(state: LSM<T>, selectable: T): LSM<T> {
    return isSelected(state, selectable)
        ? unselect(state, selectable)
        : select(state, selectable)
}
