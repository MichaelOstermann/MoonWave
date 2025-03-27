import { dfdl } from './dfdl'
import { cloneArray } from './mutations'

export const findAndRemove: {
    <T>(find: (item: T) => boolean): (target: T[]) => T[]
    <T>(target: T[], find: (item: T) => boolean): T[]
} = dfdl((target, find) => {
    const idx = target.findIndex(find)
    if (idx === -1) return target
    const clone = cloneArray(target)
    clone.splice(idx, 1)
    return clone
}, 2)
