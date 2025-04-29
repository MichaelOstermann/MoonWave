import type { CSSProperties, ReactNode } from "react"
import { Map } from "@monstermann/fn"
import { useEffect, useRef, useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export function Slider({
    active,
    autoHeight = true,
    children,
    className,
}: {
    active: number
    autoHeight?: boolean
    children: ReactNode[]
    className?: string
    height?: number
}): ReactNode {
    const [visible, setVisible] = useState<number[]>([])
    const [heights, setHeights] = useState(() => Map.create<number, number>())

    const styles = children.map((_, idx) => {
        return idx === active
            ? { opacity: 1, transform: "translateX(0)" }
            : { opacity: 0, transform: active < idx ? "translateX(100%)" : "translateX(-100%)" }
    })

    useEffect(() => {
        const timer = setTimeout(() => setVisible([active]), 200)
        return () => clearTimeout(timer)
    }, [active])

    const height = autoHeight
        ? heights.get(active)
        : undefined

    return (
        <div
            className={twMerge("relative flex", className)}
            style={{ height }}
        >
            {children.map((child, idx) => {
                return (
                    <SliderSection
                        autoHeight={autoHeight}
                        isActive={idx === active}
                        isVisible={visible.includes(idx)}
                        key={idx}
                        onResize={height => setHeights(Map.set(idx, height))}
                        style={styles[idx]}
                    >
                        {child}
                    </SliderSection>
                )
            })}
        </div>
    )
}

function SliderSection({
    autoHeight,
    children,
    isActive,
    isVisible,
    onResize,
    style,
}: {
    autoHeight: boolean
    children: ReactNode
    isActive: boolean
    isVisible: boolean
    style?: CSSProperties
    onResize: (height: number) => void
}): ReactNode {
    const ref = useRef<HTMLDivElement>(null)
    const isMounted = isVisible || isActive

    useEffect(() => {
        if (!autoHeight || !isMounted || !ref.current) return
        onResize(ref.current.scrollHeight)
    }, [autoHeight, isMounted, onResize])

    return (
        <div
            ref={ref}
            style={style}
            className={twJoin(
                "absolute inset-x-0 top-0 flex transition-[opacity,transform] duration-200 ease-in-out",
                !autoHeight && "h-full",
            )}
        >
            {isMounted && children}
        </div>
    )
}
