import type { LSMState } from '../types'
import { getSelectablesIndex } from '../internals/getSelectablesIndex'

export function getSelectable<T>(state: LSMState<T>, key: string): T | undefined {
    return getSelectablesIndex(state)[key]
}
