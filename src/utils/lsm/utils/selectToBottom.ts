import type { LSMState } from '../types'
import { selectTo } from './selectTo'

export function selectToBottom<T>(state: LSMState<T>): LSMState<T> {
    const selectable = state.selectables.at(-1)
    if (selectable === undefined) return state
    return selectTo(state, selectable)
}
