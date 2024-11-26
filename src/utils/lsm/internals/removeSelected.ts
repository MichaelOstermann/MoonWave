import type { LSMState } from '../types'
import { mergeState } from './mergeState'
import { removeAnchors } from './removeAnchors'

export function removeSelected<T>(state: LSMState<T>, keys: string[]): LSMState<T> {
    keys = keys.filter(key => state.selected.includes(key))
    if (!keys.length) return state
    state = mergeState(state, { selected: state.selected.filter(key => !keys.includes(key)) })
    return removeAnchors(state, keys)
}
