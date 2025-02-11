import { dfdl } from './dfdl'

export const findAndRemove: {
    <T>(find: (item: T) => boolean): (target: T[]) => T[]
    <T>(target: T[], find: (item: T) => boolean): T[]
} = dfdl((target, find) => {
    const idx = target.findIndex(find)
    if (idx === -1) return target
    return target.toSpliced(idx, 1)
}, 2)
