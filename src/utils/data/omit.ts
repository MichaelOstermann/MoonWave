import type { Simplify } from 'type-fest'
import { dfdl } from './dfdl'
import { markAsMutable } from './mutations'

export const omit: {
    <T extends object, K extends keyof T>(keys: readonly K[]): (target: T) => Simplify<Omit<T, K>>
    <T extends object, K extends keyof T>(target: T, keys: readonly K[]): Simplify<Omit<T, K>>
} = dfdl((target, keys) => {
    const result: any = {}
    let hasChanges = false

    for (const key in target) {
        if (keys.includes(key)) hasChanges = true
        else result[key] = target[key]
    }

    return hasChanges
        ? markAsMutable(result)
        : target
}, 2)
