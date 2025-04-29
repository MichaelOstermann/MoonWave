import { playNext } from "#actions/audio/playNext"
import { Playback } from "#src/features/Playback"
import { Tracks } from "#src/features/Tracks"
import { match } from "@monstermann/fn"
import { action } from "@monstermann/signals"

type PlaybackEvent = {
    duration?: number
    event_type: "started" | "paused" | "resumed" | "stopped" | "finished" | "position" | "seeked" | "volume"
    file_path?: string
    position?: number
    volume?: number
}

export const onPlaybackEvent = action((event: PlaybackEvent): void => {
    const { duration, event_type, file_path, position, volume } = event

    const isPlaying = match(event_type)
        .case("started", true)
        .case("paused", false)
        .case("resumed", true)
        .case("stopped", false)
        .case("finished", false)
        .orElse(() => Playback.$isPlaying())

    const trackId = file_path
        ? Tracks.$all().find(t => t.path === file_path)?.id
        : undefined

    Playback.$trackId(trackId)
    Playback.$isPlaying(isPlaying)
    Playback.$position(position ?? 0)
    Playback.$duration(duration ?? 0)
    Playback.$volume(v => volume ?? v)

    if (event_type === "finished") playNext()
})
