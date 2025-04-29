import type { ComponentProps, ReactNode } from "react"
import { createElement, useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"

interface ListProps<T> extends Omit<ComponentProps<"div">, "children"> {
    height: number
    items: T[]
    overscan?: number
    render: (props: { idx: number, item: T }) => ReactNode
}

export function List<T>({
    className,
    height,
    items,
    overscan = 0,
    ref,
    render,
    ...rest
}: ListProps<T>): ReactNode {
    const [scrollTop, setScrollTop] = useState(0)
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    const [viewportHeight, setViewportHeight] = useState(0)
    const scrollTopRef = useRef(0)
    const viewportHeightRef = useRef(0)
    const frameRef = useRef<number>(undefined)

    function schedule() {
        if (frameRef.current) return
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = undefined
            setScrollTop(scrollTopRef.current)
            setViewportHeight(viewportHeightRef.current)
        })
    }

    useEffect(() => {
        if (!container) return
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.contentRect.height
                viewportHeightRef.current = height
                schedule()
            }
        })
        observer.observe(container)
        return () => observer.disconnect()
    }, [container])

    useEffect(() => () => {
        frameRef.current && cancelAnimationFrame(frameRef.current)
    }, [])

    const startIdx = Math.max(
        0,
        Math.floor(scrollTop / height) - overscan,
    )

    const endIdx = Math.min(
        items.length,
        Math.ceil((scrollTop + viewportHeight) / height) + overscan,
    )

    const components = items.slice(startIdx, endIdx).map((item, idx) => {
        const itemIdx = startIdx + idx
        return (
            <div
                className="absolute left-0 top-0 flex w-full"
                key={itemIdx}
                style={{ transform: `translateY(${itemIdx * height}px)` }}
            >
                {createElement(render, { idx: itemIdx, item })}
            </div>
        )
    })

    return (
        <div
            {...rest}
            className={twMerge("flex size-full shrink grow overflow-y-auto contain-strict", className)}
            onScroll={(evt) => {
                scrollTopRef.current = (evt.target as HTMLDivElement).scrollTop
                schedule()
            }}
            ref={(el) => {
                setContainer(el)
                if (typeof ref === "function") ref(el)
                else if (ref) ref.current = el
            }}
        >
            <div className="relative flex w-full shrink-0" style={{ height: height * items.length }}>
                {components}
            </div>
        </div>
    )
}
