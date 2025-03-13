import type { InternalMeta, Meta } from './types'
import { endBatch, pauseTracking, resumeTracking, startBatch } from 'alien-signals'
import { getMeta } from './getMeta'
import { EVENT } from './types'

export interface EventCallback<T = void> {
    (value: T): void
}

export type EventOptions = {
    name?: string
    internal?: boolean
    meta?: InternalMeta
}

export interface Event<T = void> {
    (value: T): void
    meta: Meta
    kind: typeof EVENT
    cbs: Set<EventCallback<T>>
}

export function event<T = void>(
    options?: EventOptions,
): Event<T> {
    const event: Event<T> = function (value) {
        pauseTracking()
        startBatch()
        try {
            event.cbs.forEach(cb => cb(value))
        }
        finally {
            endBatch()
            resumeTracking()
        }
    }

    event.cbs = new Set()
    event.kind = EVENT
    event.meta = getMeta(options)

    return event
}
