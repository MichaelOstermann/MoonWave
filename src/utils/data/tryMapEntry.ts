import { dfdl } from './dfdl'

export const tryMapEntry: {
    <T, U>(key: T, transform: (value: U) => U): (target: Map<T, U>) => Map<T, U>
    <T, U>(target: Map<T, U>, key: T, transform: (value: U) => U): Map<T, U>
} = dfdl((target, key, transform) => {
    if (!target.has(key)) return target
    const prev = target.get(key)!
    const next = transform(prev)
    if (prev === next) return target
    return new Map(target).set(key, next)
}, 3)
