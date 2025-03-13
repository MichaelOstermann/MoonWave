import type { Track, View } from '@app/types'
import { audio } from '@app/state/audio/audio'
import { $loadedAudioMetadata } from '@app/state/audio/loadedAudioMetadata'
import { $waveformPeaks } from '@app/state/audio/waveformPeaks'
import { $playingView } from '@app/state/sidebar/playingView'
import { $view } from '@app/state/sidebar/view'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { $tracksById } from '@app/state/tracks/tracksById'
import { loadWaveform } from '@app/utils/waveform/loadWaveform'
import { action } from '@monstermann/signals'
import { readFile } from '@tauri-apps/plugin-fs'
import { onPlaybackSuccess } from './onPlaybackSuccess'
import { seekTo } from './seekTo'

export const playTrack = action(async ({ trackId, view }: {
    trackId: string
    view?: View
}): Promise<boolean> => {
    const track = $tracksById(trackId)()
    if (!track) return false

    const nextPlayingView = view
        ?? $playingView()
        ?? $view()

    if ($playingTrackId() === trackId) {
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
