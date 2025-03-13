import { endBatch, startBatch } from 'alien-signals'

export function batch<T>(fn: () => T): T {
    startBatch()
    try {
        return fn()
    }
    finally {
        endBatch()
    }
}
