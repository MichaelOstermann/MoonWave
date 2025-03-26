import type { ReactNode } from 'react'
import { setPlaylistIcon } from '@app/actions/playlists/setPlaylistIcon'
import { Button } from '@app/components/Button'
import { FadeInOut } from '@app/components/FadeInOut'
import { Icons } from '@app/components/Icons'
import { $viewingPlaylistIcon } from '@app/state/playlists/viewingPlaylistIcon'
import { $viewingPlaylistId } from '@app/state/playlists/viewingPlaylistId'
import { useSignal } from '@monstermann/signals'
import { LucideHeart, LucideUndo2 } from 'lucide-react'
import { Section } from '../Section'
import { SectionBody } from '../SectionBody'
import { SectionHeader } from '../SectionHeader'

export function Icon(): ReactNode {
    const activeIcon = useSignal($viewingPlaylistIcon)
    const playlistId = useSignal($viewingPlaylistId)

    return (
        <Section>
            <SectionHeader
                title="Icon"
                icon={LucideHeart}
            >
                <FadeInOut
                    show={activeIcon !== undefined}
                    onClick={() => {
                        if (!playlistId) return
                        setPlaylistIcon({ playlistId, icon: undefined })
                    }}
                >
                    <Button className="size-7">
                        <LucideUndo2 className="size-4" />
                    </Button>
                </FadeInOut>
            </SectionHeader>
            <SectionBody
                className="p-0"
                disabled={!playlistId}
            >
                <Icons
                    rowCount={6}
                    paddingX={8}
                    className="gap-y-3"
                    activeIcon={activeIcon}
                    onSelectIcon={(icon) => {
                        if (!playlistId) return
                        setPlaylistIcon({ playlistId, icon })
                    }}
                />
            </SectionBody>
        </Section>
    )
}
