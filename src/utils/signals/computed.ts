import { computed as createPreactComputed } from '@preact/signals-core'

export interface ReadonlySignal<T> {
    (): T
    id: string
    path: string
    get value(): T
    peek: () => T
}

type ComputedOptions<T> = {
    id?: string
    path?: string
    equals?: (after: T, before: T) => boolean
}

export function computed<T>(computation: (prev: T | undefined) => T, options?: ComputedOptions<T>): ReadonlySignal<T> {
    let prev: undefined | { value: T }
    const equals = options?.equals

    const $ = createPreactComputed(() => {
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
    })

    const computed = function () {
        return $.value
    } as ReadonlySignal<T>

    computed.id = options?.id || 'Anonymous'
    computed.path = options?.path || ''
    computed.peek = () => $.peek()
    Object.defineProperty(computed, 'value', { get: computed })

    return computed
}
