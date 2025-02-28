import type { LSMState } from '../types'
import { selectOne } from './selectOne'

export function selectPosition<T>(state: LSMState<T>, position: number): LSMState<T> {
    const selectable = state.selectables[position]
    if (!selectable) return state
    return selectOne(state, selectable)
}
