import type { Event, EventCallback } from './event'
import type { InternalMeta, Meta } from './types'
import { createCleanupContext, doCleanup, endCleanupContext, startCleanupContext } from './cleanupContexts'
import { createDisposeContext, endDisposeContext, startDisposeContext } from './disposeContexts'
import { getMeta } from './getMeta'

export type OnEventOptions = {
    name?: string
    internal?: boolean
    abort?: AbortSignal
    meta?: InternalMeta
}

export interface OnEvent {
    (): void
    meta: Meta
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

    const disposeEvent: OnEvent = function () {
        doCleanup(cleanupCtx)
        event.cbs.delete(exec)
        options?.meta?.dispose?.delete(disposeEvent)
        options?.abort?.removeEventListener('abort', disposeEvent)
    }

    disposeEvent.meta = getMeta(disposeEvent)

    event.cbs.add(exec)

    if (options?.meta?.dispose) options.meta.dispose.add(disposeEvent)
    if (options?.abort) options.abort.addEventListener('abort', disposeEvent)
    if (disposeCtx.value) disposeEvent()

    return disposeEvent
}
