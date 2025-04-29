import type { ReactNode } from "react"
import { toggleSidepanel } from "#actions/app/toggleSidepanel"
import { ButtonGroup } from "#components/Core/ButtonGroup"
import { Sidepanel } from "#features/Sidepanel"
import { LucideListMusic, LucideMusic3, LucidePanelRightClose, LucideSettings } from "lucide-react"
import { Button } from "../Button"
import { Slider } from "../Core/Slider"
import { PlaylistView } from "./PlaylistView"
import { SettingsView } from "./SettingsView"
import { TrackView } from "./TrackView"

export function SidepanelView(): ReactNode {
    const activeTab = Sidepanel.$activeTab()

    return (
        <div className="sidepanel flex shrink grow flex-col overflow-hidden border-l border-(--border) bg-(--bg) text-(--fg)">
            <div
                data-tauri-drag-region
                className="relative flex h-14 shrink-0 items-center justify-center border-b border-(--border)"
            >
                <Button
                    className="absolute right-3 size-7"
                    onClick={toggleSidepanel}
                >
                    <LucidePanelRightClose className="size-4" />
                </Button>
                <ButtonGroup.Root
                    active={activeTab}
                    onSelectActive={index => Sidepanel.$activeTab(index)}
                >
                    <ButtonGroup.Icon>
                        <LucideMusic3 style={{ height: 14, width: 14 }} />
                    </ButtonGroup.Icon>
                    <ButtonGroup.Icon>
                        <LucideListMusic style={{ height: 18, width: 18 }} />
                    </ButtonGroup.Icon>
                    <ButtonGroup.Icon>
                        <LucideSettings className="size-4" />
                    </ButtonGroup.Icon>
                </ButtonGroup.Root>
            </div>
            <Slider
                active={activeTab}
                autoHeight={false}
                className="shrink grow"
            >
                <TrackView />
                <PlaylistView />
                <SettingsView />
            </Slider>
        </div>
    )
}
