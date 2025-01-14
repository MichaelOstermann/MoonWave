import type { Effect } from './effect'
import { effect as createPreactEffect, untracked } from '@preact/signals-core'

type EffectOptions<T> = {
    id?: string
    path?: string
    equals?: (after: T, before: T) => boolean
}

export function changeEffect<T>(
    dependencies: () => T,
    computation: (after: T, before: T) => void,
    options?: EffectOptions<T>,
): Effect {
    let current: undefined | { value: T }
    const equals = options?.equals

    const effect = createPreactEffect(() => {
        const next = dependencies()
        if (!current) return void (current = { value: next })
        const prev = current.value
        if (prev === next || equals?.(next, prev)) return
        current = { value: next }
        untracked(() => computation(next, prev))
    }) as Effect

    effect.id = options?.id || 'Anonymous'
    effect.path = options?.path || ''

    return effect
}
