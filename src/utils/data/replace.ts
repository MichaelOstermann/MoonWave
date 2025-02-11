import { dfdl } from './dfdl'

export const replace: {
    <T>(before: T, after: T): (target: T[]) => T[]
    <T>(target: T[], before: T, after: T): T[]
} = dfdl((target, before, after) => {
    if (before === after) return target
    const idx = target.indexOf(before)
    if (idx === -1) return target
    return target.toSpliced(idx, 1, after)
}, 3)
