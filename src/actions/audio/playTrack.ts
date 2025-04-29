import type { View } from "#features/Views"
import { Library } from "#features/Library"
import { Playback } from "#features/Playback"
import { Tracks } from "#features/Tracks"
import { Views } from "#features/Views"
import { action, peek } from "@monstermann/signals"
import { invoke } from "@tauri-apps/api/core"
import { onPlaybackError } from "./onPlaybackError"
import { seekTo } from "./seekTo"

export const playTrack = action(async ({ trackId, view }: {
    trackId: string
    view?: View
}): Promise<boolean> => {
    const prevTrackId = Playback.$trackId()
    const track = Tracks.$byId.get(trackId)
    if (!track) return false

    const nextPlayingView = view
        ?? Views.$playing()
        ?? Views.$selected()

    if (prevTrackId === trackId) {
        seekTo(0)
        Views.$playing(nextPlayingView)
        invoke("resume_audio")
        return true
    }

    Playback.$peaks([])

    const waveform = Library.loadWaveform(track).catch(() => [])
    const err = await invoke("play_audio", { filePath: track.path }).catch(err => err)

    if (err) {
        onPlaybackError(trackId)
        return false
    }

    Views.$playing(nextPlayingView)

    waveform.then((peaks) => {
        if (peek(Playback.$trackId) !== trackId) return
        Playback.$peaks([peaks])
    })

    return true
})
