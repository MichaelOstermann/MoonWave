import type { LSM } from "../types"
import { getAnchorKey } from "./getAnchorKey"
import { getSelectedGroups } from "./getSelectedGroups"

export function getAnchorGroup<T>(state: LSM<T>): string[] {
    const key = getAnchorKey(state)
    if (key === undefined) return []
    return getSelectedGroups(state).find(group => group.includes(key)) ?? []
}
