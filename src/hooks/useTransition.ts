import type { CSSProperties } from "react"
import { easeInOut } from "#config/easings"
import { useUpdateEffect } from "@react-hookz/web"
import { useEffect, useState } from "react"

export type TransitionStatus = "closed" | "opening" | "closing" | "opened"

export type UseTransitionOpts = {
    animateMount?: boolean
    closeDuration: number
    closingDelay?: number
    easing?: string
    isOpen: boolean
    openDuration: number
    onChange?: (status: TransitionStatus) => void
    onClosed?: () => void
    onClosing?: () => void
    onOpened?: () => void
    onOpening?: () => void
}

export type UseTransition = {
    closeDuration: number
    easing: string
    isClosed: boolean
    isClosedOrClosing: boolean
    isClosing: boolean
    isOpen: boolean
    isOpened: boolean
    isOpenedOrOpening: boolean
    isOpening: boolean
    mounted: boolean
    openDuration: number
    status: TransitionStatus
    style: (opts: { close?: CSSProperties, open?: CSSProperties }) => CSSProperties
}

export function useTransition({
    animateMount = true,
    closeDuration,
    closingDelay = 0,
    easing = easeInOut,
    isOpen,
    onChange,
    onClosed,
    onClosing,
    onOpened,
    onOpening,
    openDuration,
}: UseTransitionOpts): UseTransition {
    const [status, setStatus] = useState<TransitionStatus>(isOpen && !animateMount ? "opened" : "closed")

    useEffect(() => {
        if (isOpen && status === "closed") {
            const raf = requestAnimationFrame(() => setStatus("opening"))
            return () => cancelAnimationFrame(raf)
        }

        if (isOpen && status === "closing") {
            const raf = requestAnimationFrame(() => setStatus("opening"))
            return () => cancelAnimationFrame(raf)
        }

        if (!isOpen && status === "opened") {
            const timeout = setTimeout(() => setStatus("closing"), closingDelay)
            return () => clearTimeout(timeout)
        }

        if (!isOpen && status === "opening") {
            const timeout = setTimeout(() => setStatus("closing"), closingDelay)
            return () => clearTimeout(timeout)
        }

        if (status === "opening") {
            const timeout = setTimeout(() => setStatus("opened"), openDuration)
            return () => clearTimeout(timeout)
        }

        if (status === "closing") {
            const timeout = setTimeout(() => setStatus("closed"), closeDuration)
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
    useUpdateEffect(() => void (status === "opening" && onOpening?.()), [status])
    useUpdateEffect(() => void (status === "opened" && onOpened?.()), [status])
    useUpdateEffect(() => void (status === "closing" && onClosing?.()), [status])
    useUpdateEffect(() => void (status === "closed" && onClosed?.()), [status])

    const isClosedOrClosing = status === "closed" || status === "closing"
    const isOpenedOrOpening = status === "opened" || status === "opening"

    return {
        closeDuration,
        easing,
        isClosed: status === "closed",
        isClosedOrClosing,
        isClosing: status === "closing",
        isOpen,
        isOpened: status === "opened",
        isOpenedOrOpening,
        isOpening: status === "opening",
        mounted: isOpen || status !== "closed",
        openDuration,
        status,
        style({ close, open }) {
            const base = (isOpenedOrOpening ? open : close) ?? {}
            const properties = Object.keys(base)
            const duration = isOpenedOrOpening ? `${openDuration}ms` : `${closeDuration}ms`
            const transition = properties.map(property => `${property} ${duration} ${easing}`).join(", ")
            return { ...base, transition }
        },
    }
}
