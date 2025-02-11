import { dfdl } from './dfdl'

export const append: {
    <T>(value: T): (target: T[]) => T[]
    <T>(target: T[], value: NoInfer<T>): T[]
} = dfdl((target, value) => {
    return [...target, value]
}, 2)
