import { computed as com, effect as eff, pauseTracking, resumeTracking } from 'alien-signals'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { SIGNAL, type Signal } from './types'

export function useSignal<T>(signalOrFn: Signal<T> | (() => T)): T {
    const sig = useMemo(() => {
        return ('kind' in signalOrFn && signalOrFn.kind === SIGNAL)
            ? signalOrFn
            : com(signalOrFn)
    }, [signalOrFn])

    const subscribe = useCallback((cb: () => void) => {
        let isFirst = true
        return eff(() => {
            sig()
            if (!isFirst) cb()
            isFirst = false
        })
    }, [sig])

    const getSnapshot = useCallback(() => {
        try {
            pauseTracking()
            return sig()
        }
        finally {
            resumeTracking()
        }
    }, [sig])

    return useSyncExternalStore(subscribe, getSnapshot)
}
