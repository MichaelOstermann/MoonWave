import { $viewingPlaylistColor } from '@app/state/playlists/viewingPlaylistColor'
import { $sidebarWidth } from '@app/state/sidebar/sidebarWidth'
import { $isSidepanelOpen } from '@app/state/sidepanel/isSidepanelOpen'
import { $isSidepanelVisible } from '@app/state/sidepanel/isSidepanelVisible'
import { $isTogglingSidepanel } from '@app/state/sidepanel/isTogglingSidepanel'
import { $prepareSidepanel } from '@app/state/sidepanel/prepareSidepanel'
import { $sidepanelWidth } from '@app/state/sidepanel/sidepanelWidth'
import { useSignal } from '@monstermann/signals'
import { twJoin } from 'tailwind-merge'
import { Sidepanel } from '../Sidepanel/Sidepanel'
import { SidebarResizeHandler } from './SidebarResizeHandler'
import { SidepanelResizeHandler } from './SidepanelResizeHandler'
import { Trackbar } from './Trackbar/Trackbar'
import { TrackList } from './TrackList'

export function Main() {
    const color = useSignal($viewingPlaylistColor)
    const isSidepanelVisible = useSignal($isSidepanelVisible)
    const isSidepanelOpen = useSignal($isSidepanelOpen)
    const isTogglingSidepanel = useSignal($isTogglingSidepanel)
    const prepareSidepanel = useSignal($prepareSidepanel)
    const sidebarWidth = useSignal($sidebarWidth)
    const sidepanelWidth = useSignal($sidepanelWidth)

    return (
        <div
            className={twJoin(
                'main absolute inset-y-0 flex flex-nowrap bg-[--bg] text-[--fg]',
                isTogglingSidepanel && 'transition-[right] duration-300 ease-in-out',
            )}
            style={{
                left: sidebarWidth,
                right: isSidepanelOpen ? 0 : -sidepanelWidth,
            }}
        >
            <div
                className="relative flex size-full flex-col"
                style={{
                    '--accent': color ? `var(--accent-${color.value})` : undefined,
                    '--fg-accent': color ? `var(--fg-${color.value})` : undefined,
                    '--bg-accent': color ? `var(--bg-${color.value})` : undefined,
                }}
            >
                <SidebarResizeHandler />
                <SidepanelResizeHandler />
                <Trackbar />
                <TrackList />
            </div>
            <div className="flex shrink-0" style={{ width: sidepanelWidth }}>
                {(prepareSidepanel || isSidepanelVisible) && <Sidepanel />}
            </div>
        </div>
    )
}
