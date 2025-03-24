import type { Event } from '../types'
import { EVENT } from '../types'

export function isEvent(value: unknown): value is Event<unknown> {
    return typeof value === 'function'
        && 'kind' in value
        && value.kind === EVENT
}
