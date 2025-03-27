import { dfdl } from './dfdl'
import { cloneMap } from './mutations'

export const setEntry: {
    <T, U>(key: T, value: NoInfer<U>): (target: Map<T, U>) => Map<T, U>
    <T, U>(target: Map<T, U>, key: NoInfer<T>, value: NoInfer<U>): Map<T, U>
} = dfdl((target, key, value) => {
    const prev = target.get(key)
    if (prev === value) return target
    const clone = cloneMap(target)
    clone.set(key, value)
    return clone
}, 3)
