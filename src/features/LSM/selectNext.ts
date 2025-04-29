import type { LSM } from "./types"
import { addSelected } from "./internals/addSelected"
import { getAnchorPosition } from "./internals/getAnchorPosition"
import { getFocusPosition } from "./internals/getFocusPosition"
import { normalize } from "./internals/normalize"
import { isSelected } from "./isSelected"
import { unselect } from "./unselect"

export function selectNext<T>(state: LSM<T>): LSM<T> {
    if (!state.multiselection) return state

    const anchorPos = getAnchorPosition(state)
    const focusPos = getFocusPosition(state)
    if (anchorPos < 0 || focusPos < 0) return state

    if (focusPos < anchorPos)
        return unselect(state, state.selectables[focusPos]!)

    const selectable = state.selectables
        .slice(focusPos)
        .find(selectable => !isSelected(state, selectable))

    return selectable
        ? normalize(addSelected(state, [state.getKey(selectable)]))
        : state
}
