import { dfdl } from './dfdl'

export const findAndMap: {
    <T>(find: (item: T) => boolean, transform: (item: T) => T): (target: T[]) => T[]
    <T>(target: T[], find: (item: T) => boolean, transform: (item: T) => T): T[]
} = dfdl((target, find, transform) => {
    const idx = target.findIndex(find)
    if (idx === -1) return target
    const prev = target[idx]!
    const next = transform(prev)
    if (prev === next) return target
    return target.toSpliced(idx, 1, next)
}, 3)
