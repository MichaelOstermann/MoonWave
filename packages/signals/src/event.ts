import type { InternalMeta } from './internals/types'
import type { Event, EventCallback } from './types'
import { endBatch, pauseTracking, resumeTracking, startBatch } from 'alien-signals'
import { onCreateEventCallbacks } from './internals/events'
import { getMeta } from './internals/getMeta'
import { EVENT } from './types'

export type EventOptions = {
    name?: string
    internal?: boolean
    meta?: InternalMeta
}

export function event<T = void>(
    options?: EventOptions,
): Event<T> {
    const cbs = new Set<EventCallback<T>>()

    const dispose: Event<T> = function (value: T): void {
        pauseTracking()
        startBatch()
        try {
            cbs.forEach(cb => cb(value))
        }
        finally {
            endBatch()
            resumeTracking()
        }
    }

    dispose.kind = EVENT
    dispose.meta = getMeta(options)
    dispose.hasListeners = () => cbs.size > 0
    dispose.subscribe = cb => void cbs.add(cb)
    dispose.unsubscribe = cb => void cbs.delete(cb)

    for (const cb of onCreateEventCallbacks)
        cb(dispose as Event<unknown>)

    return dispose
}
