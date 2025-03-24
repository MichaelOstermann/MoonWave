import type { WritableSignal } from '../types'
import { SIGNAL } from '../types'

export function isWritableSignal(value: unknown): value is WritableSignal<unknown> {
    return typeof value === 'function'
        && 'kind' in value
        && value.kind === SIGNAL
        && 'set' in value
}
