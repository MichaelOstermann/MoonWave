import { $playlistColor } from '@app/state/playlistColor'
import { useSignal } from '@app/utils/signals/useSignal'
import { Trackbar } from './Trackbar/Trackbar'
import { TrackList } from './TrackList'

export function Main() {
    const color = useSignal($playlistColor)

    return (
        <div
            className="main flex h-full shrink grow flex-col bg-[--bg] text-[--fg]"
            style={{
                '--accent': color ? `var(--accent-${color.value})` : undefined,
                '--fg-active': color ? `var(--fg-${color.value})` : undefined,
                '--bg-active': color ? `var(--bg-${color.value})` : undefined,
            }}
        >
            <Trackbar />
            <TrackList />
        </div>
    )
}
