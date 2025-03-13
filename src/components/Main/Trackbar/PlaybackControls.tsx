import type { ReactNode } from 'react'
import { playNext } from '@app/actions/audio/playNext'
import { playPrev } from '@app/actions/audio/playPrev'
import { toggleMode } from '@app/actions/audio/toggleMode'
import { togglePlayback } from '@app/actions/audio/togglePlayback'
import { Button } from '@app/components/Button'
import { $isPlaying } from '@app/state/audio/isPlaying'
import { $playingMode } from '@app/state/audio/playingMode'
import { $hasNextTrack } from '@app/state/tracks/hasNextTrack'
import { $hasPrevTrack } from '@app/state/tracks/hasPrevTrack'
import { $hasTrack } from '@app/state/tracks/hasTrack'
import { useSignal } from '@monstermann/signals'
import { LucideFastForward, LucidePause, LucidePlay, LucideRepeat, LucideRepeat1, LucideRewind, LucideShuffle } from 'lucide-react'
import { match } from 'ts-pattern'

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
    const hasPrevTrack = useSignal($hasPrevTrack)

    return (
        <Button
            onClick={playPrev}
            disabled={!hasPrevTrack}
        >
            <LucideRewind className="size-5 fill-current" />
        </Button>
    )
}

function PlayPauseButton(): ReactNode {
    const hasTrack = useSignal($hasTrack)
    const Icon = useSignal($isPlaying)
        ? LucidePause
        : LucidePlay

    return (
        <Button
            onClick={togglePlayback}
            disabled={!hasTrack}
        >
            <Icon className="size-6 fill-current" />
        </Button>
    )
}

function PlayNextButton(): ReactNode {
    const hasNextTrack = useSignal($hasNextTrack)

    return (
        <Button
            onClick={playNext}
            disabled={!hasNextTrack}
        >
            <LucideFastForward className="size-5 fill-current" />
        </Button>
    )
}

function ModeButton(): ReactNode {
    const mode = useSignal($playingMode)

    const Icon = match(mode)
        .with('SINGLE', () => LucideRepeat1)
        .with('REPEAT', () => LucideRepeat)
        .with('SHUFFLE', () => LucideShuffle)
        .exhaustive()

    return (
        <Button
            onClick={toggleMode}
            className="size-7"
        >
            <Icon className="size-4" />
        </Button>
    )
}
