import { dfdl } from './dfdl'
import { isMutable, markAsMutable } from './mutations'

export const append: {
    <T>(value: T): (target: T[]) => T[]
    <T>(target: T[], value: NoInfer<T>): T[]
} = dfdl((target, value) => {
    if (target.length === 0) return markAsMutable([value])
    if (isMutable(target)) {
        target.push(value)
        return target
    }
    return markAsMutable([...target, value])
}, 2)
