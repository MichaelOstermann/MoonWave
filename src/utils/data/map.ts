import { dfdl } from './dfdl'

export const map: {
    <T, U>(transform: (item: T) => U): (target: T[]) => U[]
    <T, U>(target: T[], transform: (item: T) => U): U[]
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
