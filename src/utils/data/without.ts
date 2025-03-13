export function without<T>(target: T[], values: NoInfer<T>[]): T[] {
    let copy
    for (const value of values) {
        const idx = (copy ?? target).indexOf(value)
        if (idx < 0) continue
        copy ??= [...target]
        copy.splice(idx, 1)
    }
    return copy ?? target
}
