import type { CSSProperties, ReactNode } from 'react'
import type { Column } from './types'
import { memo } from 'react'
import { columns } from './config'
import { TrackListHeaderColumn } from './TrackListHeaderColumn'

function Component({
    style,
    colStyles,
}: {
    style: CSSProperties
    colStyles: Record<Column, CSSProperties>
}): ReactNode {
    return (
        <div
            style={style}
            className="flex h-8 shrink-0 text-xs"
        >
            {columns.map(col => (
                <TrackListHeaderColumn
                    key={col}
                    col={col}
                    style={colStyles[col]}
                />
            ))}
        </div>
    )
}

export const TrackListHeader = memo(Component)
