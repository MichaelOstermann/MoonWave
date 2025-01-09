import type { LSMState } from '../types'
import { cached } from './cache'

const key = Symbol('selectablesIdx')

export function getSelectablesIndex<T>(state: LSMState<T>): Record<string, T> {
    return cached(state, key, () => {
        return state.selectables.reduce((acc, selectable) => {
            acc[state.getKey(selectable)] = selectable
            return acc
        }, {} as Record<string, T>)
    })
}
