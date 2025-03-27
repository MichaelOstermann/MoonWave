import { dfdl } from './dfdl'
import { cloneArray, skipMutations } from './mutations'

export const findAndMap: {
    <T>(find: (item: T) => boolean, transform: (item: T) => T): (target: T[]) => T[]
    <T>(target: T[], find: (item: T) => boolean, transform: (item: T) => T): T[]
} = dfdl((target, find, transform) => {
    const idx = target.findIndex(find)
    if (idx === -1) return target
    const prev = target[idx]!
    const next = skipMutations(() => transform(prev))
    if (prev === next) return target
    const clone = cloneArray(target)
    clone.splice(idx, 1, next)
    return clone
}, 3)
