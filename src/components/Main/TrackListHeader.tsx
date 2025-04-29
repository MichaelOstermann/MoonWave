import type { CSSProperties, ReactNode } from "react"
import type { Column } from "./types"
import { columns } from "./config"
import { TrackListHeaderColumn } from "./TrackListHeaderColumn"

export function TrackListHeader({
    colStyles,
    style,
}: {
    colStyles: Record<Column, CSSProperties>
    style: CSSProperties
}): ReactNode {
    return (
        <div
            className="flex h-8 shrink-0 text-xs"
            style={style}
        >
            {columns.map(col => (
                <TrackListHeaderColumn
                    col={col}
                    key={col}
                    style={colStyles[col]}
                />
            ))}
        </div>
    )
}
