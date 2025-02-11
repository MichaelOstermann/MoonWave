import { batch } from '@preact/signals-core'

export interface EventCallback<T = void> {
    (value: T): void
}

export interface Event<T = void> {
    (callback: EventCallback<T>): () => void
    emit: (value: T) => void
    clear: () => void
    filter: (<U extends T>(filter: (value: T) => value is U) => (callback: EventCallback<U>) => () => void)
        & ((filter: (value: T) => boolean) => (callback: EventCallback<T>) => () => void)
}

type EventOptions = {
    abort?: AbortSignal
}

export function event<T = void>(options?: EventOptions): Event<T> {
    const cbs = new Set<(value: T) => void>()

    const event = function (cb) {
        cbs.add(cb)
        return () => void cbs.delete(cb)
    } as Event<T>

    event.clear = () => cbs.clear()
    event.emit = value => batch(() => cbs.forEach(cb => cb(value)))
    event.filter = (filter: any) => (cb: any) => event(value => filter(value) && cb(value))

    options?.abort?.addEventListener('abort', event.clear)

    return event
}
