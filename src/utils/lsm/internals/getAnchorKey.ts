import type { LSMState } from '../types'
import { cached } from './cache'

const key = Symbol('anchorKey')

export function getAnchorKey<T>(state: LSMState<T>): string | undefined {
    return cached(state, key, () => {
        return Array
            .from(state.anchors)
            .sort((a, b) => state.selected.indexOf(a) - state.selected.indexOf(b))
            .at(-1)
    })
}
