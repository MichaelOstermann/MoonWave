import type { Effect } from '../types'
import { EFFECT } from '../types'

export function isEffect(value: unknown): value is Effect {
    return typeof value === 'function'
        && 'kind' in value
        && value.kind === EFFECT
}
