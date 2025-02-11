import { dfdl } from './dfdl'

export const merge: {
    <T extends object>(source: Partial<NoInfer<T>>): (target: T) => T
    <T extends object>(target: T, source: Partial<T>): T
} = dfdl((target, source) => {
    for (const key in source) {
        if (target[key] !== source[key]) {
            return { ...target, ...source }
        }
    }
    return target
}, 2)
