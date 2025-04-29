import type { ReactNode } from "react"
import { playNext } from "#actions/audio/playNext"
import { playPrev } from "#actions/audio/playPrev"
import { toggleMode } from "#actions/audio/toggleMode"
import { togglePlayback } from "#actions/audio/togglePlayback"
import { Button } from "#components/Button"
import { Playback } from "#features/Playback"
import { TrackHistory } from "#features/TrackHistory"
import { match } from "@monstermann/fn"
import { LucideFastForward, LucidePause, LucidePlay, LucideRepeat, LucideRepeat1, LucideRewind, LucideShuffle } from "lucide-react"
import { createElement } from "react"

export function PlaybackControls(): ReactNode {
    return (
        <div className="flex items-center gap-x-1">
            <PlayPrevButton />
            <PlayPauseButton />
            <PlayNextButton />
            <ModeButton />
        </div>
    )
}

function PlayPrevButton(): ReactNode {
    const hasPrevTrack = TrackHistory.$hasPrev()

    return (
        <Button
            disabled={!hasPrevTrack}
            onClick={playPrev}
        >
            <LucideRewind className="size-5 fill-current stroke-none" />
        </Button>
    )
}

function PlayPauseButton(): ReactNode {
    const canPlay = Playback.$canPlay()
    const Icon = Playback.$isPlaying()
        ? LucidePause
        : LucidePlay

    return (
        <Button
            disabled={!canPlay}
            onClick={togglePlayback}
        >
            <Icon className="size-6 fill-current stroke-none" />
        </Button>
    )
}

function PlayNextButton(): ReactNode {
    const hasNextTrack = TrackHistory.$hasNext()

    return (
        <Button
            disabled={!hasNextTrack}
            onClick={playNext}
        >
            <LucideFastForward className="size-5 fill-current stroke-none" />
        </Button>
    )
}

function ModeButton(): ReactNode {
    const mode = Playback.$mode()

    const icon = match(mode)
        .case("SINGLE", LucideRepeat1)
        .case("REPEAT", LucideRepeat)
        .case("SHUFFLE", LucideShuffle)
        .orThrow()

    return (
        <Button
            className="size-7"
            onClick={toggleMode}
        >
            {createElement(icon, { className: "size-4" })}
        </Button>
    )
}
