import type { ReactNode } from 'react'
import { playNext } from '@app/actions/playNext'
import { playPrev } from '@app/actions/playPrev'
import { toggleMode } from '@app/actions/toggleMode'
import { togglePlayback } from '@app/actions/togglePlayback'
import { Button } from '@app/components/Button'
import { $hasNextTrack, $hasPrevTrack, $hasTrack, $playing, $playingMode } from '@app/state/state'
import { LucideFastForward, LucidePause, LucidePlay, LucideRepeat, LucideRepeat1, LucideRewind, LucideShuffle } from 'lucide-react'
import { match } from 'ts-pattern'

export function PlaybackControls(): ReactNode {
    return (
        <div className="flex gap-x-2">
            <PlayPrevButton />
            <PlayPauseButton />
            <PlayNextButton />
            <ModeButton />
        </div>
    )
}

function PlayPrevButton(): ReactNode {
    return (
        <Button
            onClick={playPrev}
            disabled={!$hasPrevTrack.value}
        >
            <LucideRewind className="size-5 fill-current" />
        </Button>
    )
}

function PlayPauseButton(): ReactNode {
    const Icon = $playing.value
        ? LucidePause
        : LucidePlay

    return (
        <Button
            onClick={togglePlayback}
            disabled={!$hasTrack.value}
        >
            <Icon className="size-6 fill-current" />
        </Button>
    )
}

function PlayNextButton(): ReactNode {
    return (
        <Button
            onClick={playNext}
            disabled={!$hasNextTrack.value}
        >
            <LucideFastForward className="size-5 fill-current" />
        </Button>
    )
}

function ModeButton(): ReactNode {
    const mode = $playingMode.value

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
