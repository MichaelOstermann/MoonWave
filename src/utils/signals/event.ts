import type { InternalMeta, Meta } from './types'
import { batch, untracked } from '@preact/signals-core'
import { registerEvent } from './globals'
import { getMeta } from './helpers'

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
    cbs: Set<EventCallback<T>>
}

export function event<T = void>(
    options?: EventOptions,
): Event<T> {
    const event: Event<T> = function (value) {
        untracked(() => batch(() => event.cbs.forEach(cb => cb(value))))
    }

    event.cbs = new Set()

    event.meta = getMeta(options)

    registerEvent(event)

    return event
}
