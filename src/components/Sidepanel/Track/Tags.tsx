import type { TrackTags } from '@app/state/sidepanel/trackTags'
import type { ReactNode } from 'react'
import { Spinner } from '@app/components/Core/Spinner/Spinner'
import { FadeInOut } from '@app/components/FadeInOut'
import { $isSyncing } from '@app/state/app/isSyncing'
import { $isSavingTags } from '@app/state/sidepanel/isSavingTags'
import { $showSavingTagsDone } from '@app/state/sidepanel/showSavingTagsDone'
import { $showSavingTagsSpinner } from '@app/state/sidepanel/showSavingTagsSpinner'
import { useSignal } from '@monstermann/signals'
import { LucideCheck, LucideTag } from 'lucide-react'
import { Section } from '../Section'
import { SectionBody } from '../SectionBody'
import { SectionHeader } from '../SectionHeader'
import { SaveButton } from './SaveButton'
import { Tag } from './Tag'

const groupA: (keyof TrackTags)[] = ['title', 'artist', 'album', 'year']
const groupB: (keyof TrackTags)[] = ['trackNr', 'diskNr']

export function Tags(): ReactNode {
    const isSyncing = useSignal($isSyncing)
    const isSavingTags = useSignal($isSavingTags)
    const showSpinner = useSignal($showSavingTagsSpinner)
    const showDone = useSignal($showSavingTagsDone)

    return (
        <Section>
            <SectionHeader
                title="Tags"
                icon={LucideTag}
            >
                <SaveButton />
            </SectionHeader>
            <SectionBody className="relative items-center justify-center">
                <FadeInOut
                    show={showSpinner}
                    className="absolute"
                >
                    <Spinner
                        size={24}
                        strokeWidth={2}
                        primary="var(--fg-blue)"
                        secondary="var(--bg-blue)"
                    />
                </FadeInOut>
                <FadeInOut
                    show={showDone}
                    className="absolute"
                >
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-[--fg-blue] text-[--fg-blue]">
                        <LucideCheck className="size-4" strokeWidth={3} />
                    </div>
                </FadeInOut>
                <div
                    data-fade-out={isSavingTags || isSyncing}
                    className="easing-glide flex flex-col gap-y-3 transition-opacity duration-700 data-[fade-out=true]:opacity-40"
                >
                    <div className="flex flex-col gap-y-3">
                        {groupA.map(name => (
                            <Tag
                                key={name}
                                name={name}
                                className="gap-2"
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-[1fr_1fr] gap-x-3">
                        {groupB.map(name => (
                            <Tag
                                key={name}
                                name={name}
                                className="gap-2"
                            />
                        ))}
                    </div>
                </div>
            </SectionBody>
        </Section>
    )
}
