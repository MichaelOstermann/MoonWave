import { dfdl } from './dfdl'
import { cloneArray, skipMutations } from './mutations'

export const findAndMapOr: {
    <T>(find: (item: T) => boolean, transform: (item: T) => T, or: (target: T[]) => T[]): (target: T[]) => T[]
    <T>(target: T[], find: (item: T) => boolean, transform: (item: T) => T, or: (target: T[]) => T[]): T[]
} = dfdl((target, find, transform, or) => {
    const idx = target.findIndex(find)
    if (idx === -1) return or(target)
    const prev = target[idx]!
    const next = skipMutations(() => transform(prev))
    if (prev === next) return target
    const clone = cloneArray(target)
    clone.splice(idx, 1, next)
    return clone
}, 4)
