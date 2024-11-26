import type { LSMState } from '../types'
import { mergeState } from './mergeState'

export function removeAnchors<T>(state: LSMState<T>, keys: string[]): LSMState<T> {
    keys = keys.filter(key => state.anchors.has(key))
    if (!keys.length) return state
    const anchors = new Set(state.anchors)
    keys.forEach(key => anchors.delete(key))
    return mergeState(state, { anchors })
}
