import type { CSSProperties, ReactNode, Ref } from "react"
import "./Spinner.css"

interface SpinnerProps {
    className?: string
    primary: string
    ref?: Ref<SVGSVGElement>
    secondary: string
    size: number
    strokeWidth: number
    style?: CSSProperties
}

const VIEWBOX = 19

export function Spinner({
    className,
    primary,
    ref,
    secondary,
    size,
    strokeWidth,
    style,
}: SpinnerProps): ReactNode {
    const scale = VIEWBOX / size
    const strokeSize = strokeWidth * scale

    return (
        <svg
            className={className}
            height={size}
            ref={ref}
            style={style}
            viewBox={`0 0 ${VIEWBOX + strokeSize} ${VIEWBOX + strokeSize}`}
            width={size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="50%"
                cy="50%"
                fill="none"
                r="9.5"
                style={{
                    stroke: secondary,
                    strokeWidth: strokeSize,
                }}
            >
            </circle>
            <g
                className="origin-center"
                style={{
                    animation: "loading-spinner-animation 2s linear infinite",
                }}
            >
                <circle
                    cx="50%"
                    cy="50%"
                    fill="none"
                    r="9.5"
                    strokeLinecap="round"
                    style={{
                        animation: "loading-spinner-circle-animation 1.5s ease-in-out infinite",
                        stroke: primary,
                        strokeWidth: strokeSize,
                    }}
                >
                </circle>
            </g>
        </svg>
    )
}
