import type { LSMState } from '../types'
import { getSelectable } from './getSelectable'

export function getNthSelection<T>(state: LSMState<T>, nth: number): T | undefined {
    const key = state.selected.at(nth)
    if (key === undefined) return undefined
    return getSelectable(state, key)
}
