import type { CSSProperties } from 'react'
import { easeInOut } from '@app/config/easings'
import { useUpdateEffect } from '@react-hookz/web'
import { useEffect, useState } from 'react'

export type TransitionStatus = 'closed' | 'opening' | 'closing' | 'opened'

export type UseTransitionOpts = {
    isOpen: boolean
    easing?: string
    animateMount?: boolean
    openDuration: number
    closeDuration: number
    closingDelay?: number
    onChange?: (status: TransitionStatus) => void
    onClosed?: () => void
    onClosing?: () => void
    onOpening?: () => void
    onOpened?: () => void
}

export type UseTransition = {
    mounted: boolean
    easing: string
    status: TransitionStatus
    isOpen: boolean
    isClosed: boolean
    isClosing: boolean
    isOpening: boolean
    isOpened: boolean
    isClosedOrClosing: boolean
    isOpenedOrOpening: boolean
    openDuration: number
    closeDuration: number
    style: (opts: { open?: CSSProperties, close?: CSSProperties }) => CSSProperties
}

export function useTransition({
    isOpen,
    easing = easeInOut,
    animateMount = true,
    openDuration,
    closeDuration,
    closingDelay = 0,
    onChange,
    onClosed,
    onClosing,
    onOpening,
    onOpened,
}: UseTransitionOpts): UseTransition {
    const [status, setStatus] = useState<TransitionStatus>(isOpen && !animateMount ? 'opened' : 'closed')

    useEffect(() => {
        if (isOpen && status === 'closed') {
            const raf = requestAnimationFrame(() => setStatus('opening'))
            return () => cancelAnimationFrame(raf)
        }

        if (isOpen && status === 'closing') {
            return setStatus('opening')
        }

        if (!isOpen && status === 'opened') {
            const timeout = setTimeout(() => setStatus('closing'), closingDelay)
            return () => clearTimeout(timeout)
        }

        if (!isOpen && status === 'opening') {
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

    useUpdateEffect(() => onChange?.(status), [status])
    useUpdateEffect(() => void (status === 'opening' && onOpening?.()), [status])
    useUpdateEffect(() => void (status === 'opened' && onOpened?.()), [status])
    useUpdateEffect(() => void (status === 'closing' && onClosing?.()), [status])
    useUpdateEffect(() => void (status === 'closed' && onClosed?.()), [status])

    const isClosedOrClosing = status === 'closed' || status === 'closing'
    const isOpenedOrOpening = status === 'opened' || status === 'opening'

    return {
        mounted: isOpen || status !== 'closed',
        easing,
        isOpen,
        status,
        openDuration,
        closeDuration,
        isClosed: status === 'closed',
        isClosing: status === 'closing',
        isOpening: status === 'opening',
        isOpened: status === 'opened',
        isClosedOrClosing,
        isOpenedOrOpening,
        style({ open, close }) {
            const base = (isOpenedOrOpening ? open : close) ?? {}
            const properties = Object.keys(base)
            const duration = isOpenedOrOpening ? `${openDuration}ms` : `${closeDuration}ms`
            const transition = properties.map(property => `${property} ${duration} ${easing}`).join(', ')
            return { ...base, transition }
        },
    }
}
