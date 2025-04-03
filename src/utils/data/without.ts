import { markAsMutable } from './mutations'

export function without<T>(target: T[], values: NoInfer<T>[]): T[] {
    let hasChanges = false

    const result = target.filter((value) => {
        if (!values.includes(value)) return true
        hasChanges = true
        return false
    })

    return hasChanges
        ? markAsMutable(result)
        : target
}
