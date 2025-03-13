import type { InternalMeta, Meta } from './types'
import { effect as createEffect } from 'alien-signals'
import { createCleanupContext, doCleanup, endCleanupContext, startCleanupContext } from './cleanupContexts'
import { createDisposeContext, endDisposeContext, startDisposeContext } from './disposeContexts'
import { getMeta } from './getMeta'
import { EFFECT } from './types'

export type EffectOptions = {
    name?: string
    internal?: boolean
    abort?: AbortSignal
    meta?: InternalMeta
}

export interface Effect {
    (): void
    meta: Meta
    kind: typeof EFFECT
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

    const disposeEffect: Effect = function () {
        doCleanup(cleanupCtx)
        disposeRawEffect()
        options?.meta?.dispose?.delete(disposeEffect)
        options?.abort?.removeEventListener('abort', disposeEffect)
    }

    disposeEffect.meta = getMeta(options)
    disposeEffect.kind = EFFECT

    if (options?.meta?.dispose) options.meta.dispose.add(disposeEffect)
    if (options?.abort) options.abort.addEventListener('abort', disposeEffect)
    if (disposeCtx.value) disposeEffect()

    return disposeEffect
}
