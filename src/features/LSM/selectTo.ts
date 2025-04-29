import type { LSM } from "./types"
import { getSelectionPosition } from "./getSelectionPosition"
import { addSelected } from "./internals/addSelected"
import { getAnchorGroup } from "./internals/getAnchorGroup"
import { getAnchorPosition } from "./internals/getAnchorPosition"
import { getSelectableKeys } from "./internals/getSelectableKeys"
import { normalize } from "./internals/normalize"
import { removeSelected } from "./internals/removeSelected"

export function selectTo<T>(state: LSM<T>, selectable: T): LSM<T> {
    if (!state.multiselection) return state

    const group = getAnchorGroup(state)
    const anchorPos = getAnchorPosition(state)
    const focusPos = getSelectionPosition(state, selectable)
    if (!group || anchorPos < 0 || focusPos < 0) return state

    const startPos = Math.min(anchorPos, focusPos)
    const endPos = Math.max(anchorPos, focusPos)

    const keys = getSelectableKeys(state).slice(startPos, endPos + 1)
    if (focusPos < anchorPos) keys.reverse()

    state = removeSelected(state, group.filter(key => !keys.includes(key)))
    state = addSelected(state, keys)
    return normalize(state)
}
