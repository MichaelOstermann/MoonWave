type DisposeContext = { value: boolean }
const contexts: (DisposeContext | undefined)[] = []

export function startDisposeContext(context: DisposeContext): void {
    contexts.push(context)
}

export function endDisposeContext(): void {
    contexts.pop()
}

export function getDisposeContext(): DisposeContext | undefined {
    return contexts.at(-1)
}

export function createDisposeContext(value?: boolean): DisposeContext {
    return { value: value ?? false }
}
