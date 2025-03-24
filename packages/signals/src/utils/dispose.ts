import { getDisposeContext } from '../internals/disposeContexts'

export function dispose(): void {
    const ctx = getDisposeContext()
    if (ctx) ctx.value = true
}
