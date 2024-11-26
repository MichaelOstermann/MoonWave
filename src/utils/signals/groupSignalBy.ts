import { computed, type ReadonlySignal, signal, type Signal } from '@preact/signals-react'

export function groupSignalBy<T extends object, U extends string | number>(
    $target: Signal<T[]>,
    by: (value: T) => U,
): (value: U | null | undefined) => ReadonlySignal<T[]> {
    const cache = new Map<U, WeakRef<ReadonlySignal<T[]>>>()
    const empty = signal([])

    const $idx = computed<Record<U, T[]>>(() => {
        return $target.value.reduce((idx, value) => {
            const key = by(value)
            idx[key] ??= []
            idx[key].push(value)
            return idx
        }, {} as Record<U, T[]>)
    })

    return function (value) {
        if (value == null) return empty
        const existing = cache.get(value)?.deref()
        if (existing) return existing
        const signal = computed<T[]>(() => $idx.value[value] ?? [])
        const ref = new WeakRef(signal)
        cache.set(value, ref)
        return signal
    }
}
