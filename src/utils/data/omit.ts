import type { Simplify } from 'type-fest'
import { dfdl } from './dfdl'

export const omit: {
    <T extends object, K extends keyof T>(keys: readonly K[]): (target: T) => Simplify<Omit<T, K>>
    <T extends object, K extends keyof T>(target: T, keys: readonly K[]): Simplify<Omit<T, K>>
} = dfdl((target, keys) => {
    const result: any = {}
    for (const key in target) {
        if (keys.includes(key)) continue
        result[key] = target[key]
    }
    return result
}, 2)
