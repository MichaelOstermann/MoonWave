import type { ReactNode } from "react"
import { Playback } from "#features/Playback"
import { Theme } from "#features/Theme"
import { useWavesurfer } from "@wavesurfer/react"
import { useEffect, useRef } from "react"

export function Wavesurfer(): ReactNode {
    const container = useRef<HTMLDivElement>(null)
    const theme = Theme.$waveform()
    const duration = Playback.$duration()
    const peaks = Playback.$peaks()
    const waveColor = Theme.$waveformWaveColor()
    const progressColor = Theme.$waveformProgressColor()

    const { wavesurfer } = useWavesurfer({
        barHeight: 0.8,
        container,
        cursorColor: "rgba(0, 0, 0, 0)",
        duration,
        height: "auto",
        hideScrollbar: true,
        mediaControls: false,
        peaks,
        progressColor,
        waveColor,
        ...theme,
    })

    useEffect(() => {
        Playback.$wavesurfer(wavesurfer)
        return () => Playback.$wavesurfer(null)
    }, [wavesurfer])

    return (
        <div
            className="absolute inset-0 overflow-hidden rounded-b-md"
            ref={container}
        />
    )
}
