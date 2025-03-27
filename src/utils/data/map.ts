import { dfdl } from './dfdl'
import { cloneArray, skipMutations } from './mutations'

export const map: {
    <T, U>(transform: (item: T) => U): (target: T[]) => U[]
    <T, U>(target: T[], transform: (item: T) => U): U[]
} = dfdl((target, transform) => {
    let clone

    for (let i = 0; i < target.length; i++) {
        const prev = target[i]
        const next = skipMutations(() => transform(prev))
        if (prev === next) continue
        clone ??= cloneArray(target)
        clone[i] = next
    }

    return clone ?? target
}, 2)
