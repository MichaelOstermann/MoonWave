import { pauseTracking, resumeTracking } from 'alien-signals'

export function untracked<T>(fn: () => T): T {
    pauseTracking()
    try {
        return fn()
    }
    finally {
        resumeTracking()
    }
}
