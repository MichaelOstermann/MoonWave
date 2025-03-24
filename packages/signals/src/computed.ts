import type { InternalMeta } from './internals/types'
import { computed as createComputed, pauseTracking, resumeTracking } from 'alien-signals'
import { onCreateSignalCallbacks } from './internals/events'
import { getMeta } from './internals/getMeta'
import { type ReadonlySignal, SIGNAL } from './types'

export type ReadonlySignalOptions<T> = {
    name?: string
    internal?: boolean
    equals?: (after: T, before: T) => boolean
    meta?: InternalMeta
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

    const computed: ReadonlySignal<T> = function () {
        return rawComputed()
    }

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

    for (const cb of onCreateSignalCallbacks)
        cb(computed)

    return computed
}
