import type { ReadonlySignal as PreactReadonlySignal } from '@preact/signals-core'
import { computed as createPreactComputed } from '@preact/signals-core'

export interface ReadonlySignal<T> extends PreactReadonlySignal<T> {
    id: string
    path: string
}

type ComputedOptions<T> = {
    id?: string
    path?: string
    equals?: (after: T, before: T) => boolean
}

export function computed<T>(computation: (prev: T | undefined) => T, options?: ComputedOptions<T>): ReadonlySignal<T> {
    let prev: undefined | { value: T }
    const equals = options?.equals

    const computed = createPreactComputed(() => {
        const next = computation(prev?.value)

        if (prev) {
            if (prev.value === next) return prev.value
            if (equals?.(next, prev.value)) return prev.value
            prev.value = next
        }
        else {
            prev = { value: next }
        }

        return next
    }) as ReadonlySignal<T>

    computed.id = options?.id || 'Anonymous'
    computed.path = options?.path || ''

    return computed
}
