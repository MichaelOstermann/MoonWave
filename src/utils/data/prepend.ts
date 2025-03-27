import { dfdl } from './dfdl'
import { isMutable, markAsMutable } from './mutations'

export const prepend: {
    <T>(value: T): (target: T[]) => T[]
    <T>(target: T[], value: NoInfer<T>): T[]
} = dfdl((target, value) => {
    if (target.length === 0) return markAsMutable([value])
    if (isMutable(target)) {
        target.unshift(value)
        return target
    }
    return markAsMutable([value, ...target])
}, 2)
