import { signal as createPreactSignal } from '@preact/signals-core'

export interface Signal<T> {
    (): T
    id: string
    path: string
    get value(): T
    peek: () => T
    set: (value: T) => Signal<T>
    map: (transform: (value: T) => T) => Signal<T>
}

type SignalOptions<T> = {
    id?: string
    path?: string
    equals?: (after: T, before: T) => boolean
}

export function signal<T>(value: T, options?: SignalOptions<NoInfer<T>>): Signal<T>
export function signal<T>(value: T | null, options?: SignalOptions<NoInfer<T> | null>): Signal<T | null>
export function signal<T>(value: T | undefined, options?: SignalOptions<NoInfer<T> | undefined>): Signal<T | undefined>
export function signal<T>(value: T, options?: SignalOptions<T>) {
    const $ = createPreactSignal(value)
    const equals = options?.equals

    const signal = (() => $.value) as Signal<T>

    signal.id = options?.id || 'Anonymous'
    signal.path = options?.path || ''
    signal.peek = () => $.peek()

    signal.set = function (next: T) {
        const prev = signal.peek()
        if (prev === next) return signal
        if (equals?.(next, prev)) return signal
        $.value = next
        return signal
    }

    signal.map = function (transform: (value: T) => T) {
        return signal.set(transform(signal.peek()))
    }

    Object.defineProperty(signal, 'value', { get: signal })

    return signal
}
