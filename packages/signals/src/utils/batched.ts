import { endBatch, startBatch } from 'alien-signals'

export function batched<T extends (...args: any[]) => any>(fn: T): T {
    return function (...args) {
        startBatch()
        try {
            return fn(...args)
        }
        finally {
            endBatch()
        }
    } as T
}
