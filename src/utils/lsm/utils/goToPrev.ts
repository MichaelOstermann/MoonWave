import type { LSMState } from '../types'
import { getLastSelectionPosition } from './getLastSelectionPosition'
import { goToBottom } from './goToBottom'
import { selectOne } from './selectOne'

type GoToPrevOptions = {
    startAtBottom?: boolean
    loopAround?: boolean
}

export function goToPrev<T>(state: LSMState<T>, options?: GoToPrevOptions): LSMState<T> {
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
