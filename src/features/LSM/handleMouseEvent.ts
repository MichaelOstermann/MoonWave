import type { LSM } from "./types"
import { isSelected } from "./isSelected"
import { selectOne } from "./selectOne"
import { selectTo } from "./selectTo"
import { toggleSelect } from "./toggleSelect"

export function handleMouseEvent<T>(state: LSM<T>, selectable: T, evt?: {
    button?: number
    ctrlKey?: boolean
    metaKey?: boolean
    shiftKey?: boolean
}): LSM<T> {
    if (evt?.button === 0 || evt?.button === undefined) {
        if (evt?.metaKey || evt?.ctrlKey) return toggleSelect(state, selectable)
        if (evt?.shiftKey && state.multiselection) return selectTo(state, selectable)
        return selectOne(state, selectable)
    }

    if (evt?.button === 2) {
        if (evt?.shiftKey && state.multiselection) return selectTo(state, selectable)
        if (isSelected(state, selectable)) return state
        return selectOne(state, selectable)
    }

    return state
}
