import { dfdl } from './dfdl'
import { cloneArray, skipMutations } from './mutations'

export const findAllAndMap: {
    <T>(find: (item: T) => boolean, transform: (item: T) => T): (target: T[]) => T[]
    <T>(target: T[], find: (item: T) => boolean, transform: (item: T) => T): T[]
} = dfdl((target, find, transform) => {
    let clone

    for (let i = 0; i < target.length; i++) {
        const prev = target[i]
        if (!find(prev)) continue
        const next = skipMutations(() => transform(prev))
        if (prev === next) continue
        clone ??= cloneArray(target)
        clone[i] = next
    }

    return clone ?? target
}, 3)
