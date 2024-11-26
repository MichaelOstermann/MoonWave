import type { ReadonlySignal, Signal } from '@preact/signals-react'
import { computed, signal } from '@preact/signals-react'
import { indexBy } from '../data/indexBy'

export function indexSignalBy<T extends object, U extends PropertyKey>(
    $target: Signal<T[]>,
    by: (value: T) => U,
): (value: U | null | undefined) => ReadonlySignal<T | undefined> {
    const cache = new Map<U, WeakRef<ReadonlySignal<T | undefined>>>()
    const empty = signal(undefined)

    const $idx = computed<Record<U, T>>(() => {
        return indexBy($target.value, by)
    })

    return function (value) {
        if (value == null) return empty
        const existing = cache.get(value)?.deref()
        if (existing) return existing
        const signal = computed<T | undefined>(() => $idx.value[value])
        const ref = new WeakRef(signal)
        cache.set(value, ref)
        return signal
    }
}
