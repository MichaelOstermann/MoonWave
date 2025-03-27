import { dfdl } from './dfdl'
import { cloneMap } from './mutations'

export const removeEntry: {
    <T, U>(key: T): (target: Map<T, U>) => Map<T, U>
    <T, U>(target: Map<T, U>, key: NoInfer<T>): Map<T, U>
} = dfdl((target, key) => {
    if (!target.has(key)) return target
    const clone = cloneMap(target)
    clone.delete(key)
    return clone
}, 2)
