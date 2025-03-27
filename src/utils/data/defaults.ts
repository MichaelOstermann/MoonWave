import type { Exact, RequiredKeysOf, SetRequired } from 'type-fest'
import { cloneObject } from './mutations'

type Nil = undefined | null

type WithDefault<T, U> = [Exclude<T, Nil>] extends [never]
    ? [Exclude<U, Nil>] extends [never]
            ? T | U
            : Exclude<T | U, Nil>
    : Exclude<T | U, Nil>

type WithDefaults<T extends object, U extends object> = SetRequired<{
    [K in keyof T]: K extends keyof U
        ? WithDefault<T[K], U[K]>
        : T[K]
}, Extract<RequiredKeysOf<U>, keyof T>>

export function defaults<T extends object, U extends Partial<Exact<T, U>>>(
    target: T,
    defaults: U,
): WithDefaults<T, U> {
    let clone: any

    for (const key in defaults) {
        const before = (target as any)[key]
        const after = before ?? (defaults as any)[key]
        if (before === after) continue
        clone ??= cloneObject(target)
        clone[key] = after
    }

    return clone ?? target
}
