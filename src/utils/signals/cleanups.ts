interface Cleanup {
    (): void
}

export interface Cleanups<T> {
    run: () => void
    mount: (fn: () => T) => T
}

let current: Set<Cleanup> | null = null

export function createCleanups<T>(): Cleanups<T> {
    const cleanups: Set<Cleanup> = new Set()

    return {
        run() {
            for (const cleanup of cleanups) cleanup()
            cleanups.clear()
        },
        mount(fn) {
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

export function onCleanup(cleanup: Cleanup): void {
    current?.add(cleanup)
}
