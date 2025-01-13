import type { Track, View } from '@app/types'
import { $loadedAudioMetadata, $playingTrackId, $playingView, $tracksById, $view, $waveformPeaks, audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'
import { loadWaveform } from '@app/utils/waveform/loadWaveform'
import { readFile } from '@tauri-apps/plugin-fs'
import { onPlaybackSuccess } from './onPlaybackSuccess'
import { seekTo } from './seekTo'

export const playTrack = action(async ({ trackId, view }: {
    trackId: string
    view?: View
}): Promise<boolean> => {
    const track = $tracksById(trackId).value
    if (!track) return false

    const nextPlayingView = view
        ?? $playingView.value
        ?? $view.value

    if ($playingTrackId.value === trackId) {
        seekTo(0)
        audio.play()
        onPlaybackSuccess({ track, view: nextPlayingView })
        return true
    }

    $waveformPeaks.set([])
    $loadedAudioMetadata.set(false)

    const waveform = loadWaveform(track).catch(() => [])
    const ok = await playFile(track)
    if (!ok) return false

    onPlaybackSuccess({ track, view: nextPlayingView })

    waveform.then((peaks) => {
        if ($playingTrackId.peek() !== trackId) return
        $waveformPeaks.set([peaks])
    })

    return true
})

export function playFile(track: Track): Promise<boolean> {
    return readFile(track.path)
        .then(file => new Blob([file], { type: track.mimetype }))
        .then(blob => playBlob(blob))
        .catch(() => false)
}

function playBlob(blob: Blob): Promise<boolean> {
    const prevUrl = audio.src
    return new Promise((resolve) => {
        function onSuccess() {
            if (prevUrl) URL.revokeObjectURL(prevUrl)
            audio.removeEventListener('loadedmetadata', onSuccess)
            audio.removeEventListener('error', onError)
            resolve(true)
        }

        function onError() {
            if (prevUrl) URL.revokeObjectURL(prevUrl)
            audio.removeEventListener('loadedmetadata', onSuccess)
            audio.removeEventListener('error', onError)
            resolve(false)
        }

        audio.addEventListener('loadedmetadata', onSuccess)
        audio.addEventListener('error', onError)
        audio.src = URL.createObjectURL(blob)
        audio.play()
    })
}
