import { dfdl } from './dfdl'

export const map: {
    <T>(target: T[], transform: (item: T) => T): T[]
    <T>(transform: (item: T) => T): (target: T[]) => T[]
} = dfdl((target, transform) => {
    let clone

    for (let i = 0; i < target.length; i++) {
        const prev = target[i]
        const next = transform(prev)
        if (prev === next) continue
        clone ??= [...target]
        clone[i] = next
    }

    return clone ?? target
}, 2)
