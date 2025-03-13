import { getCleanupContext } from './cleanupContexts'

export function onCleanup(fn: () => void): void {
    getCleanupContext()?.add(fn)
}
