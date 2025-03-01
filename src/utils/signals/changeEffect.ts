import type { ReadonlySignal } from './computed'
import type { Effect } from './effect'
import type { InternalMeta } from './types'
import { effect as createPreactEffect, untracked } from '@preact/signals-core'
import { createCleanups } from './cleanups'
import { getMeta } from './helpers'

export type ChangeEffectOptions<T> = {
    name?: string
    internal?: boolean
    abort?: AbortSignal
    equals?: (after: T, before: T) => boolean
    meta?: InternalMeta
}

export function changeEffect<T>(
    dependencies: ReadonlySignal<T> | (() => T),
    computation: (after: T, before: T) => void,
    options?: ChangeEffectOptions<T>,
): Effect {
    let current: undefined | { value: T }
    const equals = options?.equals
    const cleanups = createCleanups()

    const disposePreactEffect = createPreactEffect(() => {
        const next = dependencies()
        if (!current) return void (current = { value: next })
        const prev = current.value
        if (prev === next || equals?.(next, prev)) return
        current = { value: next }
        untracked(() => {
            cleanups.run()
            cleanups.mount(() => computation(next, prev))
        })
    })

    const disposeEffect: Effect = function () {
        cleanups.run()
        disposePreactEffect()
    }

    disposeEffect.meta = getMeta(options)

    options?.abort?.addEventListener('abort', disposeEffect)

    if (import.meta.env.DEV && options?.meta?.dispose)
        options.meta.dispose.add(disposeEffect)

    return disposeEffect
}
