import { usePrevious } from '@react-hookz/web'
import { useEffect, useState } from 'react'

type Status = 'closed' | 'opening' | 'closing' | 'opened'

export function useTransition(options: {
    isOpen: boolean
    openDuration: number
    closeDuration: number
    onChange?: (status: Status) => void
}): {
        mounted: boolean
        status: Status
        isClosed: boolean
        isClosing: boolean
        isOpening: boolean
        isOpened: boolean
        isClosedOrClosing: boolean
        isOpenedOrOpening: boolean
    } {
    const [status, setStatus] = useState<Status>('closed')
    const prevStatus = usePrevious(status)

    useEffect(() => {
        if (options.isOpen && (status === 'closed' || status === 'closing')) {
            const raf = requestAnimationFrame(() => setStatus('opening'))
            return () => cancelAnimationFrame(raf)
        }

        if (!options.isOpen && (status === 'opened' || status === 'opening')) {
            return setStatus('closing')
        }

        if (status === 'opening') {
            const timeout = setTimeout(() => setStatus('opened'), options.openDuration)
            return () => clearTimeout(timeout)
        }

        if (status === 'closing') {
            const timeout = setTimeout(() => setStatus('closed'), options.closeDuration)
            return () => clearTimeout(timeout)
        }
    }, [
        status,
        options.isOpen,
        options.openDuration,
        options.closeDuration,
    ])

    useEffect(() => {
        if (!prevStatus) return
        if (prevStatus === status) return
        options.onChange?.(status)
    }, [options, prevStatus, status])

    return {
        mounted: options.isOpen || status !== 'closed',
        status,
        isClosed: status === 'closed',
        isClosing: status === 'closing',
        isOpening: status === 'opening',
        isOpened: status === 'opened',
        isClosedOrClosing: status === 'closed' || status === 'closing',
        isOpenedOrOpening: status === 'opened' || status === 'opening',
    }
}
