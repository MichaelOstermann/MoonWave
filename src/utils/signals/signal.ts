import type { InternalMeta, Meta } from './types'
import { signal as createPreactSignal } from '@preact/signals-core'
import { registerSignal } from './globals'
import { getMeta } from './helpers'

export type SignalOptions<T> = {
    name?: string
    internal?: boolean
    equals?: (after: T, before: T) => boolean
    meta?: InternalMeta
}

export interface Signal<T> {
    (): T
    meta: Meta
    peek: () => T
    set: (value: T) => Signal<T>
    map: (transform: (value: T) => T) => Signal<T>
}

export function signal<T>(value: T, options?: SignalOptions<NoInfer<T>>): Signal<T>
export function signal<T>(value: T | null, options?: SignalOptions<NoInfer<T> | null>): Signal<T | null>
export function signal<T>(value: T | undefined, options?: SignalOptions<NoInfer<T> | undefined>): Signal<T | undefined>
export function signal<T>(value: T, options?: SignalOptions<T>) {
    const preactSignal = createPreactSignal(value)
    const equals = options?.equals

    const signal = (() => preactSignal.value) as Signal<T>

    signal.meta = getMeta(options)

    signal.peek = function () {
        return preactSignal.peek()
    }

    signal.set = function (next: T) {
        const prev = signal.peek()
        if (prev === next) return signal
        if (equals?.(next, prev)) return signal
        preactSignal.value = next
        return signal
    }

    signal.map = function (transform: (value: T) => T) {
        return signal.set(transform(signal.peek()))
    }

    Object.defineProperty(signal, 'value', { get: signal })

    registerSignal(signal)

    return signal
}
