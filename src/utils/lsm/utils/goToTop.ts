import type { LSMState } from '../types'
import { selectOne } from './selectOne'

export function goToTop<T>(state: LSMState<T>): LSMState<T> {
    const selectable = state.selectables.at(0)
    if (selectable === undefined) return state
    return selectOne(state, selectable)
}
