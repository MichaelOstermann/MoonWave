import type { ComponentProps, ReactNode } from 'react'

export interface ArrowProps extends ComponentProps<'svg'> {
    width: number
    height: number
    tipRadius: number
    strokeWidth: number
}

export const Arrow = function ({
    width,
    height,
    tipRadius,
    strokeWidth,
    style,
}: ArrowProps): ReactNode | null {
    const svgX = (width / 2) * (tipRadius / -8 + 1)
    const svgY = ((height / 2) * tipRadius) / 4

    const dValue = 'M0,0'
        + ` H${width}`
        + ` L${width - svgX},${height - svgY}`
        + ` Q${width / 2},${height} ${svgX},${height - svgY}`
        + ' Z'

    return (
        <svg
            aria-hidden
            width={width + strokeWidth * 2}
            height={height}
            viewBox={`0 ${strokeWidth} ${width} ${height}`}
            style={style}
        >
            <path
                className="fill-[--bg] stroke-[--border]"
                strokeWidth={strokeWidth}
                d={dValue}
            />
        </svg>
    )
}
