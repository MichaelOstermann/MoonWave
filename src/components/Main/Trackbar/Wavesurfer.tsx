import type { ReactNode } from 'react'
import { $currentTrackDuration } from '@app/state/audio/currentTrackDuration'
import { $waveformPeaks } from '@app/state/audio/waveformPeaks'
import { $wavesurfer } from '@app/state/audio/wavesurfer'
import { $waveformProgressColor } from '@app/state/theme/waveformProgressColor'
import { $waveformTheme } from '@app/state/theme/waveformTheme'
import { $waveformWaveColor } from '@app/state/theme/waveformWaveColor'
import { useSignal } from '@monstermann/signals'
import { useWavesurfer } from '@wavesurfer/react'
import { useEffect, useRef } from 'react'

export function Wavesurfer(): ReactNode {
    const container = useRef<HTMLDivElement>(null)
    const theme = useSignal($waveformTheme)
    const duration = useSignal($currentTrackDuration)
    const peaks = useSignal($waveformPeaks)
    const waveColor = useSignal($waveformWaveColor)
    const progressColor = useSignal($waveformProgressColor)

    const { wavesurfer } = useWavesurfer({
        container,
        duration,
        peaks,
        height: 'auto',
        mediaControls: false,
        hideScrollbar: true,
        barHeight: 0.8,
        cursorColor: 'rgba(0, 0, 0, 0)',
        waveColor,
        progressColor,
        ...theme,
    })

    useEffect(() => {
        $wavesurfer.set(wavesurfer)
        return () => $wavesurfer.set(null)
    }, [wavesurfer])

    return (
        <div
            ref={container}
            className="absolute inset-0 overflow-hidden rounded-b-md"
        />
    )
}
