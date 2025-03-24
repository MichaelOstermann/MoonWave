type CleanupContext = Set<() => void>

const contexts: (CleanupContext | undefined)[] = []

export function startCleanupContext(context: CleanupContext): void {
    contexts.push(context)
}

export function endCleanupContext(): void {
    contexts.pop()
}

export function getCleanupContext(): CleanupContext | undefined {
    return contexts.at(-1)
}

export function createCleanupContext(): CleanupContext {
    return new Set()
}

export function doCleanup(context: CleanupContext): void {
    const errors: unknown[] = []

    for (const cleanup of context) {
        try {
            cleanup()
        }
        catch (err) {
            errors.push(err)
        }
    }

    context.clear()

    if (errors.length === 0) return
    // eslint-disable-next-line no-throw-literal
    if (errors.length === 1) throw errors[0]!
    throw new AggregateError(errors, 'Cleanup')
}
