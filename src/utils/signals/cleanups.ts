interface Cleanup {
    (): void
}

type Cleanups = Set<Cleanup>
let current: Cleanups | null = null

export function createCleanups() {
    const cleanups: Cleanups = new Set()

    return {
        run() {
            for (const cleanup of cleanups) cleanup()
            cleanups.clear()
        },
        mount<T>(fn: () => T): T {
            this.run()
            const prev = current
            current = cleanups
            try {
                return fn()
            }
            finally {
                current = prev
            }
        },
    }
}

export function withCleanup(cleanup: Cleanup): void {
    current?.add(cleanup)
}
