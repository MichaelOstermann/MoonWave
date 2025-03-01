import type { InternalMeta, Meta } from './types'
import { batch, untracked } from '@preact/signals-core'
import { registerAction } from './globals'
import { getMeta } from './helpers'

export interface Action<T = never, U = void> {
    (...args: ([T] extends [never] ? [] : [payload: T])): U
    meta: Meta
}

export type ActionOptions = {
    name?: string
    internal?: boolean
    meta?: InternalMeta
}

export function action<T = never, U = void>(
    fn: (payload: T) => U,
    options?: ActionOptions,
): Action<T, U> {
    const action: any = function (payload: any) {
        return untracked(() => batch(() => fn(payload)))
    }

    action.meta = getMeta(options)

    registerAction(action)

    return action
}
