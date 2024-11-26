import type { LSMState } from '../types'
import { cached } from './cache'

const key = Symbol('selectableKeys')

export function getSelectableKeys<T>(state: LSMState<T>): string[] {
    return cached(state, key, () => {
        return state.selectables.map(selectable => state.getKey(selectable))
    })
}
