import type { LSM } from "./types"
import { getSelectablesIndex } from "./internals/getSelectablesIndex"

export function getSelectable<T>(state: LSM<T>, key: string): T | undefined {
    return getSelectablesIndex(state)[key]
}
