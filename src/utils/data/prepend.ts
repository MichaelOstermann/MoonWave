import { dfdl } from './dfdl'

export const prepend: {
    <T>(value: T): (target: T[]) => T[]
    <T>(target: T[], value: NoInfer<T>): T[]
} = dfdl((target, value) => {
    return [value, ...target]
}, 2)
