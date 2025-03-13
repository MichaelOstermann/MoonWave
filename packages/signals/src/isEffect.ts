import type { Effect } from './effect'
import { EFFECT } from './types'

export function isEffect(value: unknown): value is Effect {
    return value != null
        && typeof value === 'object'
        && 'kind' in value
        && value.kind === EFFECT
}
