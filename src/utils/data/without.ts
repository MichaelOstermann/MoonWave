import { cloneArray } from './mutations'

export function without<T>(target: T[], values: NoInfer<T>[]): T[] {
    let clone
    for (const value of values) {
        const idx = (clone ?? target).indexOf(value)
        if (idx < 0) continue
        clone ??= cloneArray(target)
        clone.splice(idx, 1)
    }
    return clone ?? target
}
