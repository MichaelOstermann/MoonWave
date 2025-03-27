import { dfdl } from './dfdl'
import { cloneMap, skipMutations } from './mutations'

export const tryMapEntry: {
    <T, U>(key: T, transform: (value: U) => U): (target: Map<T, U>) => Map<T, U>
    <T, U>(target: Map<T, U>, key: T, transform: (value: U) => U): Map<T, U>
} = dfdl((target, key, transform) => {
    if (!target.has(key)) return target
    const prev = target.get(key)!
    const next = skipMutations(() => transform(prev))
    if (prev === next) return target
    const clone = cloneMap(target)
    clone.set(key, next)
    return clone
}, 3)
