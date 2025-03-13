import { dfdl } from './dfdl'

export const findAndReplace: {
    <T, U>(find: (item: T) => boolean, item: U): (target: T[]) => (T | U)[]
    <T, U>(target: T[], find: (item: T) => boolean, item: U): (T | U)[]
} = dfdl((target, find, next) => {
    const idx = target.findIndex(find)
    if (idx === -1) return target
    const prev = target[idx]!
    if (prev === next) return target
    return target.toSpliced(idx, 1, next)
}, 3)
