import { effect as createPreactEffect } from '@preact/signals-react'

export interface Effect {
    (): void
    id: string
    path: string
}

type EffectOptions = {
    id?: string
    path?: string
}

export function effect<T>(computation: (value: T | undefined) => T, options?: EffectOptions): Effect {
    let value: T | undefined

    const effect = createPreactEffect(() => {
        value = computation(value)
    }) as Effect

    effect.id = options?.id || 'Anonymous'
    effect.path = options?.path || ''

    return effect
}
