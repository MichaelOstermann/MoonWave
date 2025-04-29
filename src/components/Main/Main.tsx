import { Sidebar } from "#features/Sidebar"
import { Sidepanel } from "#features/Sidepanel"
import { SidepanelView } from "../SidepanelView"
import { SidebarResizeHandler } from "./SidebarResizeHandler"
import { Trackbar } from "./Trackbar/Trackbar"
import { TrackListView } from "./TrackListView"

export function Main() {
    const color = Sidebar.$playlistColor()
    const isSidepanelVisible = Sidepanel.$isVisible()
    const isSidepanelOpen = Sidepanel.$isOpen()
    const sidebarWidth = Sidebar.$width()

    return (
        <div
            className="main absolute inset-y-0 flex flex-nowrap"
            style={{ left: sidebarWidth, right: 0 }}
        >
            <div
                className="relative flex size-full flex-col bg-(--bg) text-(--fg)"
                style={{
                    "--accent": color ? `var(--accent-${color.value})` : undefined,
                    "--bg-accent": color ? `var(--bg-${color.value})` : undefined,
                    "--fg-accent": color ? `var(--fg-${color.value})` : undefined,
                }}
            >
                <SidebarResizeHandler />
                <Trackbar />
                <TrackListView />
            </div>
            <div
                className="absolute w-[290px] inset-y-0 right-0 flex shrink-0 transition-transform duration-200 ease-in-out contain-strict"
                style={{
                    transform: isSidepanelOpen ? "translateX(0)" : "translateX(100%)",
                }}
            >
                {isSidepanelVisible && <SidepanelView />}
            </div>
        </div>
    )
}
