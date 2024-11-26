import type { LSMState } from '../types'
import { shallowEqualArrays } from 'shallow-equal'
import { mergeState } from './mergeState'

export function addSelected<T>(state: LSMState<T>, keys: string[]): LSMState<T> {
    const slice = state.selected.slice(-keys.length)
    if (shallowEqualArrays(slice, keys)) return state
    return mergeState(state, {
        selected: state.selected.filter(k => !keys.includes(k)).concat(keys),
    })
}
