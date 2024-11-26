import type { Column, Row } from './types'
import { $playing, $playingTrackId } from '@app/state/state'
import { useComputed } from '@preact/signals-react'
import { LucideVolume, LucideVolume2 } from 'lucide-react'
import { type CSSProperties, memo, type ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'
import { iconSize } from './config'

function Component({ col, row, style }: {
    col: Column
    row: Row
    style: CSSProperties
}): ReactNode {
    const showVolumeIcon = useComputed(() => col === 'position' && $playingTrackId.value === row.id).value

    const Icon = (() => {
        if (!showVolumeIcon) return null
        return $playing.value
            ? LucideVolume2
            : LucideVolume
    })()

    return (
        <div
            key={col}
            style={style}
            className={twJoin(
                'flex h-full items-center',
                col === 'position' && 'justify-end',
                col === 'duration' && 'justify-end',
            )}
        >
            {!Icon && (
                <span className="truncate">
                    {row[col]}
                </span>
            )}
            {Icon && (
                <Icon
                    className="shrink-0 text-[--list-active-fg]"
                    style={{
                        width: iconSize,
                        height: iconSize,
                    }}
                />
            )}
        </div>
    )
}

export const TrackListRowColumn = memo(Component)
