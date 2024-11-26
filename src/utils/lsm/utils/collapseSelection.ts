import type { LSMState } from '../types'
import { getAnchorKey } from '../internals/getAnchorKey'
import { getSelectable } from './getSelectable'
import { selectOne } from './selectOne'

export function collapseSelection<T>(state: LSMState<T>): LSMState<T> {
    const key = getAnchorKey(state)
    if (key === undefined) return state
    return selectOne(state, getSelectable(state, key)!)
}
