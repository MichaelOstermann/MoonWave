import type { LSMState } from '../types'
import { selectOne } from './selectOne'

export function goToBottom<T>(state: LSMState<T>): LSMState<T> {
    const selectable = state.selectables.at(-1)
    if (selectable === undefined) return state
    return selectOne(state, selectable)
}
