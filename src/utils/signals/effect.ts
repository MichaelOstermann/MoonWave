import type { InternalMeta, Meta } from './types'
import { effect as createPreactEffect } from '@preact/signals-core'
import { createCleanups } from './cleanups'
import { getMeta } from './helpers'

export type EffectOptions = {
    name?: string
    internal?: boolean
    abort?: AbortSignal
    meta?: InternalMeta
}

export interface Effect {
    (): void
    meta: Meta
}

export function effect(
    computation: () => void,
    options?: EffectOptions,
): Effect {
    const cleanups = createCleanups()

    const disposePreactEffect = createPreactEffect(() => {
        cleanups.run()
        cleanups.mount(() => computation())
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
