import { dfdl } from './dfdl'
import { cloneArray } from './mutations'

export const findAndReplace: {
    <T, U>(find: (item: T) => boolean, item: U): (target: T[]) => (T | U)[]
    <T, U>(target: T[], find: (item: T) => boolean, item: U): (T | U)[]
} = dfdl((target, find, next) => {
    const idx = target.findIndex(find)
    if (idx === -1) return target
    const prev = target[idx]!
    if (prev === next) return target
    const clone = cloneArray(target)
    clone.splice(idx, 1, next)
    return clone
}, 3)
