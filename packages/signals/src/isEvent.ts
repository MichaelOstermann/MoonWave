import type { Event } from './event'
import { EVENT } from './types'

export function isEvent(value: unknown): value is Event {
    return value != null
        && typeof value === 'object'
        && 'kind' in value
        && value.kind === EVENT
}
