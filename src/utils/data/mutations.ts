type MutationContext = WeakSet<any>

let context: MutationContext | undefined

export function withMutations<T>(fn: () => T): T {
    const prevContext = context
    context = new WeakSet()
    try {
        return fn()
    }
    finally {
        context = prevContext
    }
}

export function skipMutations<T>(fn: () => T): T {
    const prevContext = context
    context = undefined
    try {
        return fn()
    }
    finally {
        context = prevContext
    }
}

export function cloneArray<T>(target: ReadonlyArray<T>): T[] {
    if (isMutable(target)) return target as T[]
    const clone = [...target]
    return markAsMutable(clone)
}

export function cloneObject<T extends object>(target: T): T {
    if (isMutable(target)) return target as T
    return markAsMutable({ ...target })
}

export function cloneMap<T extends Map<any, any>>(target: T): T {
    if (isMutable(target)) return target as T
    return markAsMutable(new Map(target)) as T
}

export function isMutable<T>(value: T): boolean {
    return context?.has(value) ?? false
}

export function markAsMutable<T>(value: T): T {
    context?.add(value)
    return value
}
