import type { ReactNode } from "react"
import { toggleSidepanel } from "#actions/app/toggleSidepanel"
import { Button } from "#components/Button"
import { FadeInOut } from "#components/FadeInOut"
import { Sidepanel } from "#features/Sidepanel"
import { LucidePanelRightOpen } from "lucide-react"

export function SidepanelToggle(): ReactNode {
    const isSidePanelOpen = Sidepanel.$isOpen()

    return (
        <FadeInOut keepMounted show={!isSidePanelOpen}>
            <Button
                className="size-7"
                onClick={toggleSidepanel}
            >
                <LucidePanelRightOpen className="size-4" />
            </Button>
        </FadeInOut>
    )
}
