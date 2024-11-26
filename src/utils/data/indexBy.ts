export function indexBy<T extends object, U extends PropertyKey>(
    target: T[],
    by: (value: T) => U,
): Record<U, T> {
    return target.reduce((acc, value) => {
        acc[by(value)] = value
        return acc
    }, {} as Record<U, T>)
}
