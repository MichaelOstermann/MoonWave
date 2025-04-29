import type { LSM } from "./types"

export function createLSM<T>(options?: {
    muliselection?: boolean
    selectables?: readonly T[]
    getKey?: (selectable: T) => string
}): LSM<T> {
    return {
        anchors: new Set(),
        cache: {},
        getKey: options?.getKey ?? String,
        multiselection: options?.muliselection ?? true,
        selectables: options?.selectables ?? [],
        selected: [],
    }
}
