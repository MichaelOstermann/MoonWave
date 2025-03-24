import type { InternalMeta } from './internals/types'
import type { Effect } from './types'
import { effect as createEffect } from 'alien-signals'
import { createCleanupContext, doCleanup, endCleanupContext, startCleanupContext } from './internals/cleanupContexts'
import { createDisposeContext, endDisposeContext, startDisposeContext } from './internals/disposeContexts'
import { onCreateEffectCallbacks } from './internals/events'
import { getMeta } from './internals/getMeta'
import { EFFECT } from './types'

export type EffectOptions = {
    name?: string
    internal?: boolean
    abort?: AbortSignal
    meta?: InternalMeta
}

export function effect(
    computation: () => void,
    options?: EffectOptions,
): Effect {
    const cleanupCtx = createCleanupContext()
    const disposeCtx = createDisposeContext(options?.abort?.aborted)

    const disposeRawEffect = createEffect(() => {
        if (disposeCtx.value) return
        doCleanup(cleanupCtx)
        startCleanupContext(cleanupCtx)
        startDisposeContext(disposeCtx)
        try {
            computation()
        }
        finally {
            endDisposeContext()
            endCleanupContext()
        }
    })

    const dispose: Effect = function () {
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
