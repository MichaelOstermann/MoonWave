import type { UseTransition } from "#hooks/useTransition"
import type { ComponentProps, ReactNode } from "react"
import { useWhile } from "#hooks/useWhile"
import { roundByDPR } from "#utils/roundByDPR"
import { useSignal } from "@monstermann/signals-react"
import { $mouseX, $mouseY } from "@monstermann/signals-web"
import { useMeasure } from "@react-hookz/web"
import { twMerge } from "tailwind-merge"

interface GhostProps extends ComponentProps<"div"> {
    transition: UseTransition
}

export function Ghost({
    children,
    className,
    transition,
}: GhostProps): ReactNode {
    const isDragging = transition.isOpen
    const mouseX = useWhile(useSignal($mouseX), isDragging)
    const mouseY = useWhile(useSignal($mouseY), isDragging)
    const content = useWhile(children, isDragging)

    const [contentSize, contentRef] = useMeasure<HTMLDivElement>()
    const contentWidth = contentSize?.width ?? 0
    const contentHeight = contentSize?.height ?? 0
    const x = roundByDPR(mouseX - (contentWidth / 2))
    const y = roundByDPR(mouseY - (contentHeight / 2) - 4)
    const opacityTransition = transition.style({
        close: { opacity: 0 },
        open: { opacity: 1 },
    })

    return (
        <div
            className="modal tooltip pointer-events-none absolute left-0 top-0 flex items-center justify-center whitespace-nowrap"
            style={{
                opacity: contentSize ? 1 : 0,
                transform: `translate(${x}px, ${y}px)`,
            }}
        >
            <div
                className="relative flex h-8 items-center justify-center"
                ref={contentRef}
                style={transition.style({
                    close: { transform: "scale(0.75)" },
                    open: { transform: "scale(1)" },
                })}
            >
                <div
                    style={opacityTransition}
                    className={twMerge(
                        "z-10 flex h-full items-center px-3 text-xs font-medium text-(--fg)",
                        className,
                    )}
                >
                    {content}
                </div>
                <div className="absolute z-0 flex size-full items-center justify-center overflow-hidden rounded-md">
                    <div
                        className="absolute bg-(--bg) backdrop-blur-sm"
                        style={{
                            "--tw-backdrop-blur": "blur(var(--blur))",
                            "height": "calc(100% + 50px)",
                            "width": "calc(100% + 50px)",
                            ...opacityTransition,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
