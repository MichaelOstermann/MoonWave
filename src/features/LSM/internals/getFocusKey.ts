import type { LSM } from "../types"
import { getAnchorGroup } from "./getAnchorGroup"
import { getAnchorKey } from "./getAnchorKey"

export function getFocusKey<T>(state: LSM<T>): string | undefined {
    const anchorKey = getAnchorKey(state)
    const group = getAnchorGroup(state)
    return group.at(0) === anchorKey ? group.at(-1) : group.at(0)
}
