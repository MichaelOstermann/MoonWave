import type { LSMState } from '../types'
import { getSelectablesIndex } from '../internals/getSelectablesIndex'

export function getSelections<T>(state: LSMState<T>): T[] {
    const idx = getSelectablesIndex(state)
    return state.selected
        .map(key => idx[key])
        .filter(v => v !== undefined)
}
