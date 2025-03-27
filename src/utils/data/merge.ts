import { dfdl } from './dfdl'
import { markAsMutable } from './mutations'

export const merge: {
    <T extends object>(source: Partial<NoInfer<T>>): (target: T) => T
    <T extends object>(target: T, source: Partial<NoInfer<T>>): T
} = dfdl((target, source) => {
    for (const key in source) {
        if (target[key] !== source[key]) {
            return markAsMutable({ ...target, ...source })
        }
    }
    return target
}, 2)
