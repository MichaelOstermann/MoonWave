import type { CSSProperties, ReactNode, Ref } from 'react'
import './Spinner.css'

interface SpinnerProps {
    ref?: Ref<SVGSVGElement>
    size: number
    primary: string
    secondary: string
    strokeWidth: number
    className?: string
    style?: CSSProperties
}

const VIEWBOX = 19

export function Spinner({
    ref,
    size,
    primary,
    secondary,
    strokeWidth,
    className,
    style,
}: SpinnerProps): ReactNode {
    const scale = VIEWBOX / size
    const strokeSize = strokeWidth * scale

    return (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${VIEWBOX + strokeSize} ${VIEWBOX + strokeSize}`}
            width={size}
            height={size}
            style={style}
            className={className}
        >
            <circle
                cx="50%"
                cy="50%"
                r="9.5"
                fill="none"
                style={{
                    stroke: secondary,
                    strokeWidth: strokeSize,
                }}
            >
            </circle>
            <g
                className="origin-center"
                style={{
                    animation: 'loading-spinner-animation 2s linear infinite',
                }}
            >
                <circle
                    cx="50%"
                    cy="50%"
                    r="9.5"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                        stroke: primary,
                        strokeWidth: strokeSize,
                        animation: 'loading-spinner-circle-animation 1.5s ease-in-out infinite',
                    }}
                >
                </circle>
            </g>
        </svg>
    )
}
