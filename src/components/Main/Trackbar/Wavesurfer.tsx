import type { ReactNode } from 'react'
import { $currentTrackDuration, $waveformPeaks, $waveformProgressColor, $waveformTheme, $waveformWaveColor, $wavesurfer } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
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
        return () => void ($wavesurfer.set(null))
    }, [wavesurfer])

    return (
        <div
            ref={container}
            className="absolute inset-0 overflow-hidden rounded-b-md"
        />
    )
}
