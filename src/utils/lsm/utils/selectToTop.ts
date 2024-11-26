import type { LSMState } from '../types'
import { selectTo } from './selectTo'

export function selectToTop<T>(state: LSMState<T>): LSMState<T> {
    const selectable = state.selectables.at(0)
    if (selectable === undefined) return state
    return selectTo(state, selectable)
}
