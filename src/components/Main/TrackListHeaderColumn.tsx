import type { Column } from './types'
import { type CSSProperties, memo, type ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'
import { header } from './config'

function Component({ col, style }: {
    col: Column
    style: CSSProperties
}): ReactNode {
    return (
        <div
            style={style}
            data-column={col}
            className={twJoin(
                'flex items-center',
                col === 'position' && 'justify-end',
                col === 'duration' && 'justify-end',
            )}
        >
            <span className="truncate">
                {header[col]}
            </span>
        </div>
    )
}

export const TrackListHeaderColumn = memo(Component)
