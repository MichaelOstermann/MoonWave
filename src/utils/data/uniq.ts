import { markAsMutable } from './mutations'

export function uniq<T>(target: T[]): T[] {
    const set = new Set(target)
    return set.size === target.length
        ? target
        : markAsMutable(Array.from(set))
}
