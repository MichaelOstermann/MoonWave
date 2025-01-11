import type { CSSProperties, ReactNode } from 'react'
import type { Column, Row } from './types'
import { $playing, $playingTrackId } from '@app/state/state'
import { useComputed } from '@preact/signals-react'
import { memo } from 'react'
import { twJoin } from 'tailwind-merge'
import { AudioWaveIcon } from '../AudioWaveIcon'
import { iconSize } from './config'

function Component({ col, row, style }: {
    col: Column
    row: Row
    style: CSSProperties
}): ReactNode {
    const showAudioWaveIcon = useComputed(() => {
        return col === 'position'
            && $playing.value
            && $playingTrackId.value === row.id
    }).value

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
            {!showAudioWaveIcon && (
                <span className="truncate">
                    {row[col]}
                </span>
            )}
            {showAudioWaveIcon && (
                <AudioWaveIcon style={{ width: iconSize }} />
            )}
        </div>
    )
}

export const TrackListRowColumn = memo(Component)
