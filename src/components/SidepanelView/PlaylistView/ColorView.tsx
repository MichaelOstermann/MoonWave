import type { ReactNode } from "react"
import { setPlaylistColor } from "#actions/playlists/setPlaylistColor"
import { Button } from "#components/Button"
import { FadeInOut } from "#components/FadeInOut"
import { IconColors } from "#components/IconColors"
import { Sidebar } from "#features/Sidebar"
import { LucideSwatchBook, LucideUndo2 } from "lucide-react"
import { Section } from "../Section"
import { SectionBody } from "../SectionBody"
import { SectionHeader } from "../SectionHeader"

export function ColorView(): ReactNode {
    const activeColor = Sidebar.$playlistColor()
    const playlistId = Sidebar.$playlistId()

    return (
        <Section>
            <SectionHeader
                icon={LucideSwatchBook}
                title="Color"
            >
                <FadeInOut
                    show={activeColor !== undefined}
                    onClick={() => {
                        if (!playlistId) return
                        setPlaylistColor({ color: undefined, playlistId })
                    }}
                >
                    <Button className="size-7">
                        <LucideUndo2 className="size-4" />
                    </Button>
                </FadeInOut>
            </SectionHeader>
            <SectionBody disabled={!playlistId}>
                <IconColors
                    activeColor={activeColor}
                    onSelectColor={(color) => {
                        if (!playlistId) return
                        setPlaylistColor({ color, playlistId })
                    }}
                />
            </SectionBody>
        </Section>
    )
}
