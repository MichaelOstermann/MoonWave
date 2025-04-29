import type { ComponentProps, ReactNode } from "react"
import { Map, Number } from "@monstermann/fn"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { ButtonGroupContext } from "./contexts"

export interface RootProps extends ComponentProps<"div"> {
    active: number
    children: ReactNode[]
    onSelectActive: (active: number) => void
}

export function Root({
    active,
    children,
    className,
    onSelectActive,
    ...props
}: RootProps): ReactNode {
    const [widths, setWidths] = useState(() => Map.create<number, number>())

    const width = widths.get(active) ?? 0

    const left = Array
        .from({ length: active }, (_, idx) => widths.get(idx) ?? 0)
        .reduce(Number.add, 0)

    return (
        <div
            {...props}
            className={twMerge("relative flex h-7", className)}
        >
            {children.map((child, index) => (
                <ButtonGroupContext
                    key={index}
                    value={{
                        isActive: index === active,
                        onResize: width => setWidths(Map.set(index, width)),
                        setActive: () => onSelectActive(index),
                    }}
                >
                    {child}
                </ButtonGroupContext>
            ))}
            {width !== 0 && (
                <div
                    className="absolute inset-y-0 left-0 rounded-md bg-(--bg-blue) transition-[transform,width] duration-200 ease-in-out"
                    style={{
                        transform: `translateX(${left}px)`,
                        width,
                    }}
                />
            )}
        </div>
    )
}
