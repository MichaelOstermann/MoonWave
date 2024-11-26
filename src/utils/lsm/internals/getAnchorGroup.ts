import type { LSMState } from '../types'
import { getAnchorKey } from './getAnchorKey'
import { getSelectedGroups } from './getSelectedGroups'

export function getAnchorGroup<T>(state: LSMState<T>): string[] {
    const key = getAnchorKey(state)
    if (key === undefined) return []
    return getSelectedGroups(state).find(group => group.includes(key)) ?? []
}
