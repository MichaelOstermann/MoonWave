import type { LSMState } from '../types'
import { getSelectablesIndex } from '../internals/getSelectablesIndex'

export function getLastSelection<T>(state: LSMState<T>): T | undefined {
    const key = state.selected.at(-1)
    if (key === undefined) return undefined
    return getSelectablesIndex(state)[key]
}
