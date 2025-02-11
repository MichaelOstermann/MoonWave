import { dfdl } from './dfdl'

export const removeEntry: {
    <T, U>(key: T): (target: Map<T, U>) => Map<T, U>
    <T, U>(target: Map<T, U>, key: NoInfer<T>): Map<T, U>
} = dfdl((target, key) => {
    if (!target.has(key)) return target
    target = new Map(target)
    target.delete(key)
    return target
}, 2)
