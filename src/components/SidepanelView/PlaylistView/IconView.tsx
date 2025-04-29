import type { ReactNode } from "react"
import { setPlaylistIcon } from "#actions/playlists/setPlaylistIcon"
import { Button } from "#components/Button"
import { FadeInOut } from "#components/FadeInOut"
import { Icons } from "#components/Icons"
import { Sidebar } from "#features/Sidebar"
import { LucideHeart, LucideUndo2 } from "lucide-react"
import { Section } from "../Section"
import { SectionBody } from "../SectionBody"
import { SectionHeader } from "../SectionHeader"

export function IconView(): ReactNode {
    const activeIcon = Sidebar.$playlistIcon()
    const playlistId = Sidebar.$playlistId()

    return (
        <Section>
            <SectionHeader
                icon={LucideHeart}
                title="Icon"
            >
                <FadeInOut
                    show={activeIcon !== undefined}
                    onClick={() => {
                        if (!playlistId) return
                        setPlaylistIcon({ icon: undefined, playlistId })
                    }}
                >
                    <Button className="size-7">
                        <LucideUndo2 className="size-4" />
                    </Button>
                </FadeInOut>
            </SectionHeader>
            <SectionBody
                className="px-1"
                disabled={!playlistId}
            >
                <Icons
                    activeIcon={activeIcon}
                    className="gap-y-3"
                    colCount={9}
                    paddingX={8}
                    rowCount={8}
                    onSelectIcon={(icon) => {
                        if (!playlistId) return
                        setPlaylistIcon({ icon, playlistId })
                    }}
                />
            </SectionBody>
        </Section>
    )
}
