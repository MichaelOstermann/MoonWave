import type { Signal } from '../types'
import { SIGNAL } from '../types'

export function isSignal(value: unknown): value is Signal<unknown> {
    return typeof value === 'function'
        && 'kind' in value
        && value.kind === SIGNAL
}
