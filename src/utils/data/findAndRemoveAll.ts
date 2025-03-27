import { dfdl } from './dfdl'
import { cloneArray } from './mutations'

export const findAndRemoveAll: {
    <T>(find: (item: T) => boolean): (target: T[]) => T[]
    <T>(target: T[], find: (item: T) => boolean): T[]
} = dfdl((target, find) => {
    let clone
    let i = target.length

    while (i--) {
        const item = target[i]
        if (!find(item)) continue
        clone ??= cloneArray(target)
        clone.splice(i, 1)
    }

    return clone ?? target
}, 2)
