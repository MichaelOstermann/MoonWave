import type { ReactNode } from 'react'
import { $currentTrackDuration, $waveformPeaks, $waveformProgressColor, $waveformTheme, $waveformWaveColor, $wavesurfer } from '@app/state/state'
import { useWavesurfer } from '@wavesurfer/react'
import { useEffect, useRef } from 'react'

export function Wavesurfer(): ReactNode {
    const container = useRef<HTMLDivElement>(null)
    const theme = $waveformTheme.value
    const { wavesurfer } = useWavesurfer({
        container,
        duration: $currentTrackDuration.value,
        peaks: $waveformPeaks.value,
        height: 'auto',
        mediaControls: false,
        hideScrollbar: true,
        barHeight: 0.8,
        cursorColor: 'rgba(0, 0, 0, 0)',
        waveColor: $waveformWaveColor.value,
        progressColor: $waveformProgressColor.value,
        ...theme,
    })

    useEffect(() => {
        $wavesurfer.set(wavesurfer)
        return () => void ($wavesurfer.set(null))
    }, [wavesurfer])

    return (
        <div
            ref={container}
            className="absolute inset-0 overflow-hidden rounded-b-md opacity-0 group-hover:opacity-100"
        />
    )
}
