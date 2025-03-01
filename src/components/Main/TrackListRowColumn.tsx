import type { CSSProperties, ReactNode } from 'react'
import type { Column, Row } from './types'
import { $isPlaying } from '@app/state/isPlaying'
import { $playingTrackId } from '@app/state/playingTrackId'
import { useSignal } from '@app/utils/signals/useSignal'
import { twJoin } from 'tailwind-merge'
import { AudioWaveIcon } from '../AudioWaveIcon'
import { FadeInOut } from '../FadeInOut'
import { iconSize } from './config'

export function TrackListRowColumn({ col, row, style }: {
    col: Column
    row: Row
    style: CSSProperties
}): ReactNode {
    const showAudioWaveIcon = useSignal(() => {
        return col === 'position'
            && $isPlaying()
            && $playingTrackId() === row.id
    })

    return (
        <div
            key={col}
            style={style}
            className={twJoin(
                'flex h-full items-center',
                col === 'position' && 'relative justify-end tabular-nums',
                col === 'duration' && 'justify-end tabular-nums',
            )}
        >
            {col === 'position' && (
                <Position
                    position={row[col]}
                    showAudioWaveIcon={showAudioWaveIcon}
                />
            )}
            {col !== 'position' && (
                <span className="truncate">
                    {row[col]}
                </span>
            )}
        </div>
    )
}

function Position({ position, showAudioWaveIcon }: {
    position: string
    showAudioWaveIcon: boolean
}): ReactNode {
    return (
        <>
            <FadeInOut animateInitial={false} show={!showAudioWaveIcon} className="absolute">
                {position}
            </FadeInOut>
            <FadeInOut show={showAudioWaveIcon} className="absolute">
                <AudioWaveIcon style={{ width: iconSize }} />
            </FadeInOut>
        </>
    )
}
