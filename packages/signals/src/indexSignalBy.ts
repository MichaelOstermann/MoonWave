import type { ReadonlySignal } from './computed'
import type { Signal } from './signal'
import { computed } from './computed'
import { signal } from './signal'

export function indexSignalBy<T extends object, U extends PropertyKey>(
    $target: Signal<T[]>,
    by: (value: T) => U,
): (value: U | null | undefined) => ReadonlySignal<T | undefined> {
    const cache = new Map<U, WeakRef<ReadonlySignal<T | undefined>>>()
    const empty = signal(undefined)

    const $idx = computed<Record<U, T>>(() => {
        const result = {} as Record<U, T>
        for (const value of $target())
            result[by(value)] = value
        return result
    })

    return function (value) {
        if (value == null) return empty
        const existing = cache.get(value)?.deref()
        if (existing) return existing
        const signal = computed<T | undefined>(() => $idx()[value])
        const ref = new WeakRef(signal)
        cache.set(value, ref)
        return signal
    }
}
