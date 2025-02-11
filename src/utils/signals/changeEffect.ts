import type { ReadonlySignal } from './computed'
import type { Effect } from './effect'
import { effect as createPreactEffect, untracked } from '@preact/signals-core'
import { createCleanups } from './cleanups'

type EffectOptions<T> = {
    id?: string
    path?: string
    abort?: AbortSignal
    equals?: (after: T, before: T) => boolean
}

export function changeEffect<T>(
    dependencies: ReadonlySignal<T> | (() => T),
    computation: (after: T, before: T) => void,
    options?: EffectOptions<T>,
): Effect {
    let current: undefined | { value: T }
    const equals = options?.equals
    const cleanups = createCleanups()

    const effect = createPreactEffect(() => {
        const next = dependencies()
        if (!current) return void (current = { value: next })
        const prev = current.value
        if (prev === next || equals?.(next, prev)) return
        current = { value: next }
        untracked(() => {
            cleanups.mount(() => computation(next, prev))
        })
    }) as Effect

    const dispose = function () {
        cleanups.run()
        effect()
    }

    // effect.id = options?.id || 'Anonymous'
    // effect.path = options?.path || ''
    options?.abort?.addEventListener('abort', dispose)

    return dispose
}
