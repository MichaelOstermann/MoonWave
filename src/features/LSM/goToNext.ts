import type { LSM } from "./types"
import { getLastSelectionPosition } from "./getLastSelectionPosition"
import { goToTop } from "./goToTop"
import { selectOne } from "./selectOne"

type GoToNextOptions = {
    loopAround?: boolean
    startAtTop?: boolean
}

export function goToNext<T>(state: LSM<T>, options?: GoToNextOptions): LSM<T> {
    const position = getLastSelectionPosition(state)

    if (position < 0) {
        return options?.startAtTop !== false
            ? goToTop(state)
            : state
    }

    if (position === state.selectables.length - 1) {
        return options?.loopAround === true
            ? goToTop(state)
            : state
    }

    return selectOne(state, state.selectables[position + 1]!)
}
