import type { LSMState } from '../types'
import { shallowEqualArrays } from 'shallow-equal'
import { mergeState } from '../internals/mergeState'
import { normalize } from '../internals/normalize'

export function setSelectables<T>(state: LSMState<T>, selectables: readonly T[]): LSMState<T> {
    if (shallowEqualArrays(state.selectables as T[], selectables as T[])) return state
    state = mergeState(state, { selectables })
    return normalize(state)
}
