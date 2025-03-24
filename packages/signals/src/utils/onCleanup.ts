import { getCleanupContext } from '../internals/cleanupContexts'

export function onCleanup(fn: () => void): void {
    getCleanupContext()?.add(fn)
}
