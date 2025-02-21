import { usePrevious } from '@react-hookz/web'
import { useEffect, useState } from 'react'

export type TransitionStatus = 'closed' | 'opening' | 'closing' | 'opened'

export function useTransition({
    isOpen,
    animateInitial = true,
    openDuration,
    closeDuration,
    closingDelay = 0,
    onChange,
}: {
    isOpen: boolean
    animateInitial?: boolean
    openDuration: number
    closeDuration: number
    closingDelay?: number
    onChange?: (status: TransitionStatus) => void
}): {
        mounted: boolean
        status: TransitionStatus
        isClosed: boolean
        isClosing: boolean
        isOpening: boolean
        isOpened: boolean
        isClosedOrClosing: boolean
        isOpenedOrOpening: boolean
    } {
    const [status, setStatus] = useState<TransitionStatus>(isOpen && !animateInitial ? 'opened' : 'closed')
    const prevStatus = usePrevious(status)

    useEffect(() => {
        if (isOpen && (status === 'closed' || status === 'closing')) {
            const raf = requestAnimationFrame(() => setStatus('opening'))
            return () => cancelAnimationFrame(raf)
        }

        if (!isOpen && (status === 'opened' || status === 'opening')) {
            const timeout = setTimeout(() => setStatus('closing'), closingDelay)
            return () => clearTimeout(timeout)
        }

        if (status === 'opening') {
            const timeout = setTimeout(() => setStatus('opened'), openDuration)
            return () => clearTimeout(timeout)
        }

        if (status === 'closing') {
            const timeout = setTimeout(() => setStatus('closed'), closeDuration)
            return () => clearTimeout(timeout)
        }

        return undefined
    }, [
        status,
        isOpen,
        openDuration,
        closeDuration,
        closingDelay,
    ])

    useEffect(() => {
        if (!prevStatus) return
        if (prevStatus === status) return
        onChange?.(status)
    }, [onChange, prevStatus, status])

    return {
        mounted: isOpen || status !== 'closed',
        status,
        isClosed: status === 'closed',
        isClosing: status === 'closing',
        isOpening: status === 'opening',
        isOpened: status === 'opened',
        isClosedOrClosing: status === 'closed' || status === 'closing',
        isOpenedOrOpening: status === 'opened' || status === 'opening',
    }
}
