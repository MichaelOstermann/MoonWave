import type { Signal } from './signal'
import { effect } from 'alien-signals'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { computed } from './computed'

const e = effect

export function useSignal<T>(signal: Signal<T>): T
export function useSignal<T>(fn: () => T): T
export function useSignal<T>(signalOrFn: Signal<T> | (() => T)): T {
    const signal = useMemo(() => {
        return typeof signalOrFn === 'function'
            ? computed(signalOrFn)
            : signalOrFn
    }, [signalOrFn])

    const subscribe = useCallback((cb: () => void) => {
        let isFirst = true
        return e(() => {
            signal()
            if (!isFirst) cb()
            isFirst = false
        })
    }, [signal])

    return useSyncExternalStore(subscribe, signal.peek)
}
