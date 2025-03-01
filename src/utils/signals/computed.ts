import type { InternalMeta, Meta } from './types'
import { computed as createPreactComputed } from '@preact/signals-core'
import { registerSignal } from './globals'
import { getMeta } from './helpers'

export type ReadonlySignalOptions<T> = {
    name?: string
    internal?: boolean
    equals?: (after: T, before: T) => boolean
    meta?: InternalMeta
}

export interface ReadonlySignal<T> {
    (): T
    meta: Meta
    peek: () => T
}

export function computed<T>(
    computation: () => T,
    options?: ReadonlySignalOptions<T>,
): ReadonlySignal<T> {
    let prev: undefined | { value: T }
    const equals = options?.equals

    const preactComputed = createPreactComputed(() => {
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
        return preactComputed.value
    } as ReadonlySignal<T>

    computed.meta = getMeta(options)

    computed.peek = function () {
        return preactComputed.peek()
    }

    Object.defineProperty(computed, 'value', { get: computed })

    registerSignal(computed)

    return computed
}
