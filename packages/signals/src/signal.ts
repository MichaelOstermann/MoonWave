import type { InternalMeta } from './internals/types'
import type { WritableSignal } from './types'
import { signal as createSignal, pauseTracking, resumeTracking } from 'alien-signals'
import { onCreateSignalCallbacks } from './internals/events'
import { getMeta } from './internals/getMeta'
import { SIGNAL } from './types'

export type SignalOptions<T> = {
    name?: string
    internal?: boolean
    equals?: (after: T, before: T) => boolean
    meta?: InternalMeta
}

export function signal<T>(value: T, options?: SignalOptions<NoInfer<T>>): WritableSignal<T>
export function signal<T>(value: T | null, options?: SignalOptions<NoInfer<T> | null>): WritableSignal<T | null>
export function signal<T>(value: T | undefined, options?: SignalOptions<NoInfer<T> | undefined>): WritableSignal<T | undefined>
export function signal<T>(value: T, options?: SignalOptions<T>) {
    const rawSignal = createSignal(value)
    const equals = options?.equals

    const signal: WritableSignal<T> = () => rawSignal()

    signal.meta = getMeta(options)
    signal.kind = SIGNAL

    signal.peek = function () {
        pauseTracking()
        const value = rawSignal()
        resumeTracking()
        return value
    }

    signal.set = function (next: T): void {
        const prev = signal.peek()
        if (prev === next) return
        if (equals?.(next, prev)) return
        rawSignal(next)
    }

    signal.map = function (transform: (value: T) => T): void {
        signal.set(transform(signal.peek()))
    }

    for (const cb of onCreateSignalCallbacks)
        cb(signal)

    return signal
}
