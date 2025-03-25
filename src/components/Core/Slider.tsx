import type { CSSProperties, ReactNode } from 'react'
import { setEntry } from '@app/utils/data/setEntry'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function Slider({
    active,
    children,
    className,
    dynamicHeight = true,
}: {
    active: number
    children: ReactNode[]
    className?: string
    height?: number
    dynamicHeight?: boolean
}): ReactNode {
    const [visible, setVisible] = useState<number[]>([])
    const [heights, setHeights] = useState(new Map<number, number>())

    const styles = children.map((_, idx) => {
        return idx === active
            ? { opacity: 1, transform: 'translateX(0)' }
            : { opacity: 0, transform: active < idx ? 'translateX(100%)' : 'translateX(-100%)' }
    })

    useEffect(() => {
        const timer = setTimeout(() => setVisible([active]), 300)
        return () => clearTimeout(timer)
    }, [active])

    const height = dynamicHeight
        ? heights.get(active)
        : undefined

    return (
        <div
            style={{ height }}
            className={twMerge('relative flex', className)}
        >
            {children.map((child, idx) => {
                return (
                    <SliderSection
                        key={idx}
                        isActive={idx === active}
                        isVisible={visible.includes(idx)}
                        measureHeight={dynamicHeight}
                        style={styles[idx]}
                        onResize={height => setHeights(setEntry(idx, height))}
                    >
                        {child}
                    </SliderSection>
                )
            })}
        </div>
    )
}

function SliderSection({
    style,
    isActive,
    isVisible,
    measureHeight,
    children,
    onResize,
}: {
    style?: CSSProperties
    isActive: boolean
    isVisible: boolean
    measureHeight: boolean
    children: ReactNode
    onResize: (height: number) => void
}): ReactNode {
    const ref = useRef<HTMLDivElement>(null)
    const isMounted = isVisible || isActive

    useEffect(() => {
        if (!measureHeight || !isMounted || !ref.current) return
        onResize(ref.current.scrollHeight)
    }, [measureHeight, isMounted, onResize])

    return (
        <div
            ref={ref}
            style={style}
            className="absolute inset-x-0 top-0 flex transition-[opacity,transform] duration-300 ease-in-out"
        >
            {isMounted && children}
        </div>
    )
}
