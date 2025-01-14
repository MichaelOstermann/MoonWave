import type { Signal } from '@preact/signals-core'
import { useSyncExternalStore } from 'react'
import { computed } from './computed'

export function useSignal<T>(signal: Signal<T>): T
export function useSignal<T>(fn: () => T): T
export function useSignal<T>(signalOrFn: Signal<T> | (() => T)): T {
    const signal = typeof signalOrFn === 'function'
        ? computed(signalOrFn)
        : signalOrFn

    return useSyncExternalStore(
        signal.subscribe.bind(signal),
        signal.peek.bind(signal),
    )
}
