import type { ReactNode } from 'react'
import { toggleSidepanel } from '@app/actions/app/toggleSidepanel'
import { $activeSidepanelTab } from '@app/state/sidepanel/activeSidepanelTab'
import { useSignal } from '@monstermann/signals'
import { LucideListMusic, LucideMusic3, LucidePanelRightClose, LucideSettings } from 'lucide-react'
import { Button } from '../Button'
import { ButtonGroupIcon } from '../Core/ButtonGroup/ButtonGroupIcon'
import { ButtonGroupRoot } from '../Core/ButtonGroup/ButtonGroupRoot'
import { Slider } from '../Core/Slider'
import { Playlist } from './Playlist/Playlist'
import { Settings } from './Settings/Settings'
import { Track } from './Track/Track'

export function Sidepanel(): ReactNode {
    const activeTab = useSignal($activeSidepanelTab)

    return (
        <div className="sidepanel flex shrink grow flex-col overflow-hidden border-l border-[--border] bg-[--bg] text-[--fg]">
            <div
                data-tauri-drag-region
                className="relative flex h-14 shrink-0 items-center justify-center border-b border-[--border]"
            >
                <Button
                    onClick={toggleSidepanel}
                    className="absolute right-3 size-7"
                >
                    <LucidePanelRightClose className="size-4" />
                </Button>
                <ButtonGroupRoot
                    active={activeTab}
                    onSelectActive={index => $activeSidepanelTab.set(index)}
                >
                    <ButtonGroupIcon>
                        <LucideMusic3 style={{ width: 14, height: 14 }} />
                    </ButtonGroupIcon>
                    <ButtonGroupIcon>
                        <LucideListMusic style={{ width: 18, height: 18 }} />
                    </ButtonGroupIcon>
                    <ButtonGroupIcon>
                        <LucideSettings className="size-4" />
                    </ButtonGroupIcon>
                </ButtonGroupRoot>
            </div>
            <Slider
                active={activeTab}
                dynamicHeight={false}
            >
                <Track />
                <Playlist />
                <Settings />
            </Slider>
        </div>
    )
}
