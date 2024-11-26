import type { LSMState } from '../types'
import { cached } from './cache'
import { getSelectableKeys } from './getSelectableKeys'

const key = Symbol('groups')

export function getSelectedGroups<T>(state: LSMState<T>): string[][] {
    return cached(state, key, () => {
        const keys = getSelectableKeys(state)

        const positions = keys.reduce((acc, key, idx) => {
            acc[key] = idx
            return acc
        }, {} as Record<string, number>)

        return state.selected
            .toSorted((a, b) => positions[a]! - positions[b]!)
            .reduce((groups, key) => {
                const group = groups.at(-1)

                if (group && positions[group.at(-1)!] === positions[key]! - 1) {
                    group.push(key)
                    return groups
                }

                groups.push([key])
                return groups
            }, [] as string[][])
    })
}
