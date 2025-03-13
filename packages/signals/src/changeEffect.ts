import type { ReadonlySignal } from './computed'
import type { Effect } from './effect'
import { effect as createEffect, pauseTracking, resumeTracking } from 'alien-signals'
import { createCleanupContext, doCleanup, endCleanupContext, startCleanupContext } from './cleanupContexts'
import { createDisposeContext, endDisposeContext, startDisposeContext } from './disposeContexts'
import { getMeta } from './getMeta'
import { EFFECT, type InternalMeta } from './types'

export type ChangeEffectOptions<T> = {
    name?: string
    internal?: boolean
    abort?: AbortSignal
    equals?: (after: T, before: T) => boolean
    meta?: InternalMeta
}

export function changeEffect<T>(
    dependencies: ReadonlySignal<T> | (() => T),
    computation: (after: T, before: T) => void,
    options?: ChangeEffectOptions<T>,
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
