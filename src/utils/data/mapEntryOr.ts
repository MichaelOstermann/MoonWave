import { dfdl } from './dfdl'

export const mapEntryOr: {
    <T, U>(key: T, transform: (value: U) => U, or: (target: Map<T, U>) => Map<T, U>): (target: Map<T, U>) => Map<T, U>
    <T, U>(target: Map<T, U>, key: T, transform: (value: U) => U, or: (target: Map<T, U>) => Map<T, U>): Map<T, U>
} = dfdl((target, key, transform, or) => {
    if (!target.has(key)) return or(target)
    const prev = target.get(key)!
    const next = transform(prev)
    if (prev === next) return target
    return new Map(target).set(key, next)
}, 4)
