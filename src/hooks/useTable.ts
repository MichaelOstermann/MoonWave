import type { CSSProperties } from "react"

type ColumnName = string

type Column<T extends ColumnName = any> = {
    minWidth: number
    name: T
    originalWidth: number
    paddingLeft: number
    paddingRight: number
    reserved: boolean
    width: number
}

type Config<T extends ColumnName> = {
    availableWidth: number
    colStyles?: CSSProperties
    columns: readonly T[]
    gap?: number
    innerPadding?: number
    measurements: Record<T, number[]>
    minWidths?: Partial<Record<T, number>>
    outerPadding?: number
    reservedColumns?: Partial<Record<T, boolean>>
}

export function useTable<T extends ColumnName>(config: Config<T>): {
    colStyles: Record<T, CSSProperties>
    outerStyles: CSSProperties
    varStyles: Record<string, string>
} {
    const cols = useCols(config)

    const outerPadding = config.outerPadding ?? 0
    const hasMeasurements = config.availableWidth !== 0
    const outerStyles = {
        opacity: hasMeasurements ? 100 : 0,
        paddingLeft: outerPadding,
        paddingRight: outerPadding,
    }

    const varStyles = cols.reduce((acc, col, idx) => {
        acc[`--table-${col.name}-order`] = String(idx)
        acc[`--table-${col.name}-width`] = `${widthOf(col)}px`
        acc[`--table-${col.name}-padding-left`] = `${col.paddingLeft}px`
        acc[`--table-${col.name}-padding-right`] = `${col.paddingRight}px`
        return acc
    }, {} as Record<string, string>)

    const colStyles = config.columns.reduce((acc, col) => {
        acc[col] = {
            order: `var(--table-${col}-order)`,
            paddingLeft: `var(--table-${col}-padding-left)`,
            paddingRight: `var(--table-${col}-padding-right)`,
            width: `var(--table-${col}-width)`,
            ...config.colStyles,
        }
        return acc
    }, {} as Record<T, CSSProperties>)

    return {
        colStyles,
        outerStyles,
        varStyles,
    }
}

function useCols<T extends ColumnName>(config: Config<T>): Column<T>[] {
    const outerPadding = config.outerPadding ?? 0
    const innerPadding = config.innerPadding ?? 0
    const gap = config.gap ?? 0

    const cols = config.columns.map<Column<T>>((col, idx, cols) => {
        const measurements = config.measurements[col]
        const reserved = config.reservedColumns?.[col] === true
        const isFirstCol = idx === 0
        const isLastCol = idx === cols.length - 1

        const paddingLeft = isFirstCol ? innerPadding : gap / 2
        const paddingRight = isLastCol ? innerPadding : gap / 2

        const originalWidth = max(measurements)
        const minWidth = config.minWidths?.[col] ?? 0
        const width = reserved ? originalWidth : max(removeOutliers(measurements))

        return {
            minWidth,
            name: col,
            originalWidth,
            paddingLeft,
            paddingRight,
            reserved,
            width: Math.max(width, minWidth),
        }
    })

    const availableWidth = config.availableWidth - outerPadding * 2
    let currentWidth = cols.reduce((a, b) => a + widthOf(b), 0)
    const adjustableCols = cols.filter(col => !col.reserved)

    while (currentWidth < availableWidth) {
        const target = getSmallestExpandableCol(cols)
        if (!target) break
        target.width += 1
        currentWidth += 1
    }

    while (currentWidth > availableWidth) {
        const target = getBiggestShrinkableCol(adjustableCols)
        if (!target) break
        target.width -= 1
        currentWidth -= 1
    }

    if (currentWidth !== availableWidth) {
        const adjustment = (availableWidth - currentWidth) / adjustableCols.length
        adjustableCols.forEach(col => col.width += adjustment)
    }

    return cols
}

function removeOutliers(values: number[]): number[] {
    const sorted = [...values].sort((a, b) => a - b)

    const q1Index = Math.floor(sorted.length * 0.25)
    const q1 = sorted[q1Index]!

    const q3Index = Math.floor(sorted.length * 0.75)
    const q3 = sorted[q3Index]!

    const iqr = q3 - q1
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr

    return values.filter(x => x >= lowerBound && x <= upperBound)
}

function getBiggestShrinkableCol<T extends Column>(cols: T[]): T | undefined {
    return cols.reduce<T | undefined>((acc, col) => {
        if (col.reserved) return acc
        if (col.width <= col.minWidth) return acc
        if (!acc) return col
        return acc.width > col.width ? acc : col
    }, undefined)
}

function getSmallestExpandableCol<T extends Column>(cols: T[]): T | undefined {
    return cols.reduce<T | undefined>((acc, col) => {
        if (col.reserved) return acc
        if (col.width >= col.originalWidth) return acc
        if (!acc) return col
        return acc.width < col.width ? acc : col
    }, undefined)
}

function max(values: number[]): number {
    return values.length
        ? Math.max(...values)
        : 0
}

function widthOf(col: Column): number {
    return col.width + col.paddingLeft + col.paddingRight
}
