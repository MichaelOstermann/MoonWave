import type { ReadonlySignal } from './computed'
import { SIGNAL } from './types'

export function isSignal(value: unknown): value is ReadonlySignal<unknown> {
    return value != null
        && typeof value === 'object'
        && 'kind' in value
        && value.kind === SIGNAL
}
