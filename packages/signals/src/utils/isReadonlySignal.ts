import type { ReadonlySignal } from '../types'
import { SIGNAL } from '../types'

export function isReadonlySignal(value: unknown): value is ReadonlySignal<unknown> {
    return typeof value === 'function'
        && 'kind' in value
        && value.kind === SIGNAL
        && !('set' in value)
}
