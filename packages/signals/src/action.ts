import type { InternalMeta, Meta } from './types'
import { endBatch, pauseTracking, resumeTracking, startBatch } from 'alien-signals'
import { getMeta } from './getMeta'

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
        pauseTracking()
        startBatch()
        try {
            return fn(payload)
        }
        finally {
            endBatch()
            resumeTracking()
        }
    }

    action.meta = getMeta(options)

    return action
}
