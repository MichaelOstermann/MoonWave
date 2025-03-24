import type { InternalMeta } from './internals/types'
import type { Event, EventCallback, OnEvent } from './types'
import { createCleanupContext, doCleanup, endCleanupContext, startCleanupContext } from './internals/cleanupContexts'
import { createDisposeContext, endDisposeContext, startDisposeContext } from './internals/disposeContexts'
import { getMeta } from './internals/getMeta'

export type OnEventOptions = {
    name?: string
    internal?: boolean
    abort?: AbortSignal
    meta?: InternalMeta
}

export function onEvent<T = void>(
    event: Event<T>,
    callback: EventCallback<T>,
    options?: OnEventOptions,
): OnEvent {
    const cleanupCtx = createCleanupContext()
    const disposeCtx = createDisposeContext(options?.abort?.aborted)

    const exec: EventCallback<T> = function (value) {
        if (disposeCtx.value) return
        doCleanup(cleanupCtx)
        startCleanupContext(cleanupCtx)
        startDisposeContext(disposeCtx)
        try {
            callback(value)
        }
        finally {
            endDisposeContext()
            endCleanupContext()
        }
    }

    const dispose: OnEvent = function () {
        doCleanup(cleanupCtx)
        event.unsubscribe(exec)
        options?.meta?.dispose?.delete(dispose)
        options?.abort?.removeEventListener('abort', dispose)
    }

    dispose.meta = getMeta(options)
    event.subscribe(exec)

    if (disposeCtx.value) {
        dispose()
        return dispose
    }

    if (options?.meta?.dispose) options.meta.dispose.add(dispose)
    if (options?.abort) options.abort.addEventListener('abort', dispose)

    return dispose
}
