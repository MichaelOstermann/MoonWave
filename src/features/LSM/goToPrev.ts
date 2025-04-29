import type { LSM } from "./types"
import { getLastSelectionPosition } from "./getLastSelectionPosition"
import { goToBottom } from "./goToBottom"
import { selectOne } from "./selectOne"

type GoToPrevOptions = {
    loopAround?: boolean
    startAtBottom?: boolean
}

export function goToPrev<T>(state: LSM<T>, options?: GoToPrevOptions): LSM<T> {
    const position = getLastSelectionPosition(state)

    if (position < 0) {
        return options?.startAtBottom !== false
            ? goToBottom(state)
            : state
    }

    if (position === 0) {
        return options?.loopAround === true
            ? goToBottom(state)
            : state
    }

    return selectOne(state, state.selectables[position - 1]!)
}
