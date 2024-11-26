import type { Signal as PreactSignal } from '@preact/signals-react'
import { signal as createPreactSignal } from '@preact/signals-react'

type OnChange<T> = (after: T, before: T, signal: Signal<T>) => void

export interface Signal<T> extends PreactSignal<T> {
    id: string
    path: string
    onChange: (callback: OnChange<T>) => () => void
    set: (value: T) => Signal<T>
    map: (transform: (value: T) => T) => Signal<T>
}

type SignalOptions<T> = {
    id?: string
    path?: string
    equals?: (after: T, before: T) => boolean
}

export function signal<T>(value: T, options?: SignalOptions<T>): Signal<T>
export function signal<T = undefined>(): Signal<T | undefined>
export function signal<T>(value?: T, options?: SignalOptions<T>): Signal<T> {
    const signal = createPreactSignal(value) as Signal<T>
    const equals = options?.equals
    const onChange = new Set<OnChange<T>>()

    signal.id = options?.id || 'Anonymous'
    signal.path = options?.path || ''

    signal.set = function (next) {
        const prev = signal.peek()
        if (prev === next) return signal
        if (equals?.(next, prev)) return signal
        for (const cb of onChange) cb(next, prev, signal)
        signal.value = next
        return signal
    }

    signal.map = function (transform) {
        return signal.set(transform(signal.peek()))
    }

    signal.onChange = function (callback) {
        onChange.add(callback)
        return () => void onChange.delete(callback)
    }

    return signal
}
