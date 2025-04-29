import type { ComponentProps, ReactNode } from "react"
import { useResizeObserver } from "@react-hookz/web"
import { use, useRef } from "react"
import { twMerge } from "tailwind-merge"
import { ButtonGroupContext } from "./contexts.ts"

export interface IconProps extends ComponentProps<"div"> {}

export function Icon({ children, className, ...props }: IconProps): ReactNode {
    const { isActive, onResize, setActive } = use(ButtonGroupContext)
    const ref = useRef<HTMLDivElement>(null)

    useResizeObserver(ref, entry => onResize(entry.contentRect.width))

    return (
        <div
            className="flex h-full"
            onClick={setActive}
            ref={ref}
        >
            <div
                {...props}
                data-active={isActive}
                className={twMerge(
                    "flex aspect-square h-full items-center justify-center rounded-md transition-transform duration-300 ease-in-out active:scale-[0.8] data-[active=true]:text-(--fg-blue)",
                    className,
                )}
            >
                {children}
            </div>
        </div>
    )
}
