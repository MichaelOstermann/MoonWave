import { dfdl } from './dfdl'

export const findAllAndMap: {
    <T>(target: T[], find: (item: T) => boolean, transform: (item: T) => T): T[]
    <T>(find: (item: T) => boolean, transform: (item: T) => T): (target: T[]) => T[]
} = dfdl((target, find, transform) => {
    let clone

    for (let i = 0; i < target.length; i++) {
        const prev = target[i]
        if (!find(prev)) continue
        const next = transform(prev)
        if (prev === next) continue
        clone ??= [...target]
        clone[i] = next
    }

    return clone ?? target
}, 3)
