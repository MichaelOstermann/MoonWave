import type { Simplify } from 'type-fest'
import { dfdl } from './dfdl'

export const pick: {
    <T extends object, K extends keyof T>(keys: readonly K[]): (target: T) => Simplify<Pick<T, K>>
    <T extends object, K extends keyof T>(target: T, keys: readonly K[]): Simplify<Pick<T, K>>
} = dfdl((target, keys) => {
    const result: any = {}
    for (const key of keys)
        result[key] = target[key]
    return result
}, 2)
