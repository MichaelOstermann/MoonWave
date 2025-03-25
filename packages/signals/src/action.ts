import type { InternalMeta } from './internals/types'
import { endBatch, pauseTracking, resumeTracking, startBatch } from 'alien-signals'
import { createCleanupContext, doCleanup, endCleanupContext, startCleanupContext } from './internals/cleanupContexts'
import { onCreateActionCallbacks } from './internals/events'
import { getMeta } from './internals/getMeta'
import { ACTION, type Action } from './types'

export type ActionOptions = {
    name?: string
    internal?: boolean
    meta?: InternalMeta
}

export function action<T = never, U = void>(
    fn: (payload: T) => U,
    options?: ActionOptions,
): Action<T, U> {
    const cleanupCtx = createCleanupContext()

    const action: Action<T, U> = function (payload?: any) {
        pauseTracking()
        startBatch()
        doCleanup(cleanupCtx)
        startCleanupContext(cleanupCtx)
        try {
            return fn(payload)
        }
        finally {
            endCleanupContext()
            endBatch()
            resumeTracking()
        }
    }

    action.meta = getMeta(options)
    action.kind = ACTION

    for (const cb of onCreateActionCallbacks)
        cb(action as Action<unknown, unknown>)

    return action
}
