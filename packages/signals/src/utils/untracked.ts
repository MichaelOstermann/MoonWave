import { pauseTracking, resumeTracking } from 'alien-signals'

export function untracked<T extends (...args: any[]) => any>(fn: T): T {
    return function (...args) {
        pauseTracking()
        try {
            return fn(...args)
        }
        finally {
            resumeTracking()
        }
    } as T
}
