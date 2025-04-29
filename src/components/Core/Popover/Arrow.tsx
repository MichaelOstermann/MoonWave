import type { ComponentProps, ReactNode } from "react"

export interface ArrowProps extends ComponentProps<"svg"> {
    height: number
    strokeWidth: number
    tipRadius: number
    width: number
}

export function Arrow({
    height,
    strokeWidth,
    style,
    tipRadius,
    width,
}: ArrowProps): ReactNode {
    if (width === 0 || height === 0) return null

    const svgX = (width / 2) * (tipRadius / -8 + 1)
    const svgY = ((height / 2) * tipRadius) / 4

    const dValue = "M0,0"
        + ` H${width}`
        + ` L${width - svgX},${height - svgY}`
        + ` Q${width / 2},${height} ${svgX},${height - svgY}`
        + " Z"

    return (
        <svg
            aria-hidden
            height={height}
            style={style}
            viewBox={`0 ${strokeWidth} ${width} ${height}`}
            width={width + strokeWidth * 2}
        >
            <path
                className="fill-(--bg) stroke-(--border)"
                d={dValue}
                strokeWidth={strokeWidth}
            />
        </svg>
    )
}
