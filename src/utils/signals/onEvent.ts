import type { Event, EventCallback } from './event'
import type { InternalMeta, Meta } from './types'
import { createCleanups } from './cleanups'
import { getMeta } from './helpers'

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
    const cleanups = createCleanups()

    const exec: EventCallback<T> = function (value) {
        cleanups.run()
        cleanups.mount(() => callback(value))
    }

    const dispose: OnEvent = function () {
        cleanups.run()
        event.cbs.delete(exec)
    }

    dispose.meta = getMeta(dispose)

    event.cbs.add(exec)

    if (import.meta.env.DEV && options?.meta?.dispose)
        options.meta.dispose.add(dispose)

    return dispose
}
