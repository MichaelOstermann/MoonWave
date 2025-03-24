import { pauseTracking, resumeTracking } from 'alien-signals'

export function untrack<T>(fn: () => T): T {
    pauseTracking()
    try {
        return fn()
    }
    finally {
        resumeTracking()
    }
}
