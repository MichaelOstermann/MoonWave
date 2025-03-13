import type { InternalMeta, Meta } from './types'
import { computed as createComputed, pauseTracking, resumeTracking } from 'alien-signals'
import { getMeta } from './getMeta'
import { SIGNAL } from './types'

export type ReadonlySignalOptions<T> = {
    name?: string
    internal?: boolean
    equals?: (after: T, before: T) => boolean
    meta?: InternalMeta
}

export interface ReadonlySignal<T> {
    (): T
    meta: Meta
    kind: typeof SIGNAL
    peek: () => T
}

export function computed<T>(
    computation: () => T,
    options?: ReadonlySignalOptions<T>,
): ReadonlySignal<T> {
    let prev: undefined | { value: T }
    const equals = options?.equals

    const rawComputed = createComputed(() => {
        const next = computation()

        if (prev) {
            if (prev.value === next) return prev.value
            if (equals?.(next, prev.value)) return prev.value
            prev.value = next
        }
        else {
            prev = { value: next }
        }

        return next
    })

    const computed = function () {
        return rawComputed()
    } as ReadonlySignal<T>

    computed.meta = getMeta(options)
    computed.kind = SIGNAL

    computed.peek = function () {
        pauseTracking()
        try {
            return computed()
        }
        finally {
            resumeTracking()
        }
    }

    return computed
}
