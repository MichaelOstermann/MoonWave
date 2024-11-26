import type { LSMState } from '../types'
import { addAnchors } from './addAnchors'
import { getSelectablesIndex } from './getSelectablesIndex'
import { getSelectedGroups } from './getSelectedGroups'
import { removeAnchors } from './removeAnchors'
import { removeSelected } from './removeSelected'

export function normalize<T>(state: LSMState<T>): LSMState<T> {
    const keys = getSelectablesIndex(state)

    // Remove invalid selections.
    const selectionsToRemove = state.selected.filter(key => !Object.hasOwn(keys, key))
    state = removeSelected(state, selectionsToRemove)

    // Remove invalid anchors.
    const anchorsToRemove = Array.from(state.anchors).filter(key => !state.selected.includes(key))
    state = removeAnchors(state, anchorsToRemove)

    state = normalizeAnchors(state)
    return state
}

// Make sure that each group contains one anchor, either at the beginning or end.
function normalizeAnchors<T>(state: LSMState<T>): LSMState<T> {
    const anchorsToAdd: string[] = []
    const anchorsToRemove: string[] = []

    for (const group of getSelectedGroups(state)) {
        const anchors = group
            .filter(key => state.anchors.has(key))
            .sort((a, b) => state.selected.indexOf(a) - state.selected.indexOf(b))

        const mruAnchor = anchors.pop()

        if (!mruAnchor) {
            anchorsToAdd.push(group.at(0)!)
        }
        else if (mruAnchor !== group.at(0) && mruAnchor !== group.at(-1)) {
            anchorsToAdd.push(group.at(0)!)
            anchorsToRemove.push(mruAnchor)
            anchorsToRemove.push(...anchors)
        }
        else {
            anchorsToRemove.push(...anchors)
        }
    }

    state = addAnchors(state, anchorsToAdd)
    state = removeAnchors(state, anchorsToRemove)

    return state
}
