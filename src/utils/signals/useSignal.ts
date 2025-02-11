import type { Signal } from './signal'
import { effect } from '@preact/signals-core'
import { useSyncExternalStore } from 'react'
import { computed } from './computed'

export function useSignal<T>(signal: Signal<T>): T
export function useSignal<T>(fn: () => T): T
export function useSignal<T>(signalOrFn: Signal<T> | (() => T)): T {
    const signal = typeof signalOrFn === 'function'
        ? computed(signalOrFn)
        : signalOrFn

    return useSyncExternalStore(
        (cb) => {
            let isFirst = true
            return effect(() => {
                signal()
                if (!isFirst) cb()
                isFirst = false
            })
        },
        () => signal.peek(),
    )
}
