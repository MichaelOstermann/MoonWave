import type { Exact, RequiredKeysOf, SetRequired } from 'type-fest'

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
    const result = { ...target } as any
    for (const key in defaults) {
        result[key] ??= (defaults as any)[key]
    }
    return result
}
