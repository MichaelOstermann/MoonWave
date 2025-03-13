import type { ReactNode } from 'react'
import { setPlaylistColor } from '@app/actions/playlists/setPlaylistColor'
import { Button } from '@app/components/Button'
import { FadeInOut } from '@app/components/FadeInOut'
import { IconColors } from '@app/components/IconColors'
import { $viewingPlaylistColor } from '@app/state/playlists/viewingPlaylistColor'
import { $viewingPlaylistId } from '@app/state/playlists/viewingPlaylistId'
import { useSignal } from '@monstermann/signals'
import { LucideSwatchBook, LucideUndo2 } from 'lucide-react'
import { Section } from '../Section'
import { SectionBody } from '../SectionBody'
import { SectionHeader } from '../SectionHeader'

export function Color(): ReactNode {
    const activeColor = useSignal($viewingPlaylistColor)
    const playlistId = useSignal($viewingPlaylistId)

    return (
        <Section>
            <SectionHeader
                title="Color"
                icon={LucideSwatchBook}
            >
                <FadeInOut
                    show={activeColor !== undefined}
                    onClick={() => {
                        if (!playlistId) return
                        setPlaylistColor({ playlistId, color: undefined })
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
                        setPlaylistColor({ playlistId, color })
                    }}
                />
            </SectionBody>
        </Section>
    )
}
