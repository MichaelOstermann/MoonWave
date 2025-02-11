import { effect as createPreactEffect } from '@preact/signals-core'
import { createCleanups } from './cleanups'

export interface Effect {
    (): void
}

type EffectOptions = {
    id?: string
    path?: string
    abort?: AbortSignal
}

export function effect<T>(
    computation: (value: T | undefined) => T | undefined,
    options?: EffectOptions,
): Effect {
    let value: T | undefined
    const cleanups = createCleanups()

    const effect = createPreactEffect(() => {
        cleanups.mount(() => {
            value = computation(value)
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
