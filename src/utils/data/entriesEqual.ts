export function entriesEqual<T extends Set<any> | Map<any, any>>(a: T, b: T): boolean {
    if (a === b) return true
    if (a.size !== b.size) return false
    for (const value of a) {
        if (!b.has(value)) return false
    }
    return true
}
