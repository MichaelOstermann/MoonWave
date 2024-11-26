import type { LSMState } from '../types'

export function createLSM<T>(options?: {
    selectables?: readonly T[]
    muliselection?: boolean
    getKey?: (selectable: T) => string
}): LSMState<T> {
    return {
        selected: [],
        selectables: options?.selectables ?? [],
        anchors: new Set(),
        multiselection: options?.muliselection ?? true,
        getKey: options?.getKey ?? String,
        cache: {},
    }
}
