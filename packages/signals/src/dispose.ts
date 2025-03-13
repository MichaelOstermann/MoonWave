import { getDisposeContext } from './disposeContexts'

export function dispose(): void {
    const ctx = getDisposeContext()
    if (ctx) ctx.value = true
}
