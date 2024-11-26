import { Trackbar } from './Trackbar/Trackbar'
import { TrackList } from './TrackList'

export function Main() {
    return (
        <div className="main flex h-full shrink grow flex-col bg-[--bg] text-[--fg]">
            <Trackbar />
            <TrackList />
        </div>
    )
}
