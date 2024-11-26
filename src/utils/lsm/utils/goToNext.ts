import type { LSMState } from '../types'
import { getLastSelectionPosition } from './getLastSelectionPosition'
import { goToTop } from './goToTop'
import { selectOne } from './selectOne'

type GoToNextOptions = {
    startAtTop?: boolean
    loopAround?: boolean
}

export function goToNext<T>(state: LSMState<T>, options?: GoToNextOptions): LSMState<T> {
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
