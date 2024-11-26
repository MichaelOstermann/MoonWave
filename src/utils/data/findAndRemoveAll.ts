import { dfdl } from './dfdl'

export const findAndRemoveAll: {
    <T>(target: T[], find: (item: T) => boolean): T[]
    <T>(find: (item: T) => boolean): (target: T[]) => T[]
} = dfdl((target, find) => {
    const items = target.filter(find)
    if (!items.length) return target
    const copy = [...target]
    for (const item of items) {
        copy.splice(copy.indexOf(item), 1)
    }
    return copy
}, 2)
