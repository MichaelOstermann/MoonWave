import type { Action } from '../types'
import { ACTION } from '../types'

export function isAction(value: unknown): value is Action<unknown> {
    return typeof value === 'function'
        && 'kind' in value
        && value.kind === ACTION
}
