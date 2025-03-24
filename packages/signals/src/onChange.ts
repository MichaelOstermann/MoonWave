import type { InternalMeta } from './internals/types'
import type { Effect } from './types'
import { effect as createEffect, pauseTracking, resumeTracking } from 'alien-signals'
import { createCleanupContext, doCleanup, endCleanupContext, startCleanupContext } from './internals/cleanupContexts'
import { createDisposeContext, endDisposeContext, startDisposeContext } from './internals/disposeContexts'
import { onCreateEffectCallbacks } from './internals/events'
import { getMeta } from './internals/getMeta'
import { EFFECT } from './types'

export type OnChangeOptions<T> = {
    name?: string
    internal?: boolean
    abort?: AbortSignal
    equals?: (after: T, before: T) => boolean
    meta?: InternalMeta
}

export function onChange<T>(
    dependencies: () => T,
    computation: (after: T, before: T) => void,
    options?: OnChangeOptions<T>,
): Effect {
    let current: undefined | { value: T }
    const equals = options?.equals

    const cleanupCtx = createCleanupContext()
    const disposeCtx = createDisposeContext(options?.abort?.aborted)

    const disposeRawEffect = createEffect(() => {
        if (disposeCtx.value) return
        const next = dependencies()
        if (!current) return void (current = { value: next })
        const prev = current.value
        if (prev === next || equals?.(next, prev)) return
        current = { value: next }
        doCleanup(cleanupCtx)
        pauseTracking()
        startCleanupContext(cleanupCtx)
        startDisposeContext(disposeCtx)
        try {
            computation(next, prev)
        }
        finally {
            endDisposeContext()
            endCleanupContext()
            resumeTracking()
        }
    })

    const dispose = function () {
        doCleanup(cleanupCtx)
        disposeRawEffect()
        options?.meta?.dispose?.delete(dispose)
        options?.abort?.removeEventListener('abort', dispose)
    }

    dispose.meta = getMeta(options)
    dispose.kind = EFFECT

    if (disposeCtx.value) {
        dispose()
        return dispose
    }

    if (options?.meta?.dispose) options.meta.dispose.add(dispose)
    if (options?.abort) options.abort.addEventListener('abort', dispose)
    for (const cb of onCreateEffectCallbacks) cb(dispose)

    return dispose
}
