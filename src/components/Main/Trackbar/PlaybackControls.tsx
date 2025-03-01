import type { ReactNode } from 'react'
import { playNext } from '@app/actions/playNext'
import { playPrev } from '@app/actions/playPrev'
import { toggleMode } from '@app/actions/toggleMode'
import { togglePlayback } from '@app/actions/togglePlayback'
import { Button } from '@app/components/Button'
import { $hasNextTrack } from '@app/state/hasNextTrack'
import { $hasPrevTrack } from '@app/state/hasPrevTrack'
import { $hasTrack } from '@app/state/hasTrack'
import { $isPlaying } from '@app/state/isPlaying'
import { $playingMode } from '@app/state/playingMode'
import { useSignal } from '@app/utils/signals/useSignal'
import { LucideFastForward, LucidePause, LucidePlay, LucideRepeat, LucideRepeat1, LucideRewind, LucideShuffle } from 'lucide-react'
import { match } from 'ts-pattern'

export function PlaybackControls(): ReactNode {
    return (
        <div className="flex gap-x-1">
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
        <Button onClick={toggleMode}>
            <Icon className="size-4" />
        </Button>
    )
}
