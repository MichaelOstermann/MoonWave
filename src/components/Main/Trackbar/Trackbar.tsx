import type { ReactNode } from 'react'
import { CurrentTrack } from './CurrentTrack'
import { PlaybackControls } from './PlaybackControls'
import { SyncProgress } from './SyncProgress'
import { VolumeControls } from './VolumeControls'

export function Trackbar(): ReactNode {
    return (
        <div
            data-tauri-drag-region
            className="trackbar no-shrink flex h-14 items-center px-5"
        >
            <div
                data-tauri-drag-region
                className="flex h-full w-1/4 items-center justify-center"
            >
                <PlaybackControls />
            </div>
            <div className="flex h-full w-2/4 justify-center">
                <CurrentTrack />
            </div>
            <div
                data-tauri-drag-region
                className="flex h-full w-1/4 justify-center"
            >
                <VolumeControls />
            </div>
            <div className="flex h-full shrink-0 items-center">
                <SyncProgress />
            </div>
        </div>
    )
}
