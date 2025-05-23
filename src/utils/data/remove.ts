import { cloneArray } from './mutations'

export function remove<T>(target: T[], value: NoInfer<T>): T[] {
    const idx = target.indexOf(value)
    if (idx < 0) return target
    const clone = cloneArray(target)
    clone.splice(idx, 1)
    return clone
}
