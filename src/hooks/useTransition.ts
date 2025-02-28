import type { CSSProperties } from 'react'
import { usePrevious } from '@react-hookz/web'
import { useEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'

export type TransitionStatus = 'closed' | 'opening' | 'closing' | 'opened'

export type UseTransitionOpts = {
    isOpen: boolean
    easing?: string
    animateInitial?: boolean
    openDuration: number
    closeDuration: number
    closingDelay?: number
    className?: string
    openClassName?: string
    closeClassName?: string
    onChange?: (status: TransitionStatus) => void
}

export type UseTransition = {
    mounted: boolean
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
    style: CSSProperties
    className: string
}

export function useTransition({
    isOpen,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    animateInitial = true,
    openDuration,
    closeDuration,
    closingDelay = 0,
    className,
    openClassName,
    closeClassName,
    onChange,
}: UseTransitionOpts): UseTransition {
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

    const isClosedOrClosing = status === 'closed' || status === 'closing'
    const isOpenedOrOpening = status === 'opened' || status === 'opening'

    const style = isOpen
        ? { '--transition-duration': `${openDuration}ms`, '--transition-easing': easing }
        : { '--transition-duration': `${closeDuration}ms`, '--transition-easing': easing }

    const tClassName = twJoin(
        'transition-[transform,opacity] duration-[--transition-duration] ease-[--transition-easing]',
        className,
        isOpenedOrOpening && openClassName,
        isClosedOrClosing && closeClassName,
    )

    return {
        mounted: isOpen || status !== 'closed',
        isOpen,
        status,
        style,
        className: tClassName,
        openDuration,
        closeDuration,
        isClosed: status === 'closed',
        isClosing: status === 'closing',
        isOpening: status === 'opening',
        isOpened: status === 'opened',
        isClosedOrClosing,
        isOpenedOrOpening,
    }
}
