import type { EditableTags } from "#features/Tags"
import type { ReactNode } from "react"
import { Spinner } from "#components/Core/Spinner/Spinner"
import { FadeInOut } from "#components/FadeInOut"
import { Library } from "#features/Library"
import { Tags } from "#features/Tags"
import { LucideCheck, LucideTag } from "lucide-react"
import { Section } from "../Section"
import { SectionBody } from "../SectionBody"
import { SectionHeader } from "../SectionHeader"
import { SaveButton } from "./SaveButton"
import { TagView } from "./TagView"

const groupA: (keyof EditableTags)[] = ["title", "artist", "album", "year"]
const groupB: (keyof EditableTags)[] = ["trackNr", "diskNr"]

export function TagsView(): ReactNode {
    const isSyncing = Library.$isSyncing()
    const isSavingTags = Tags.$isSaving()
    const showSpinner = Tags.$showSavingSpinner()
    const showDone = Tags.$showSavingDone()
    const hasEditableTags = Tags.$hasEditable()

    return (
        <Section>
            <SectionHeader
                icon={LucideTag}
                title="Tags"
            >
                <SaveButton />
            </SectionHeader>
            <SectionBody
                className="relative items-center justify-center"
                disabled={!hasEditableTags || isSyncing}
            >
                <FadeInOut
                    className="absolute"
                    show={showSpinner}
                >
                    <Spinner
                        primary="var(--fg-blue)"
                        secondary="var(--bg-blue)"
                        size={24}
                        strokeWidth={2}
                    />
                </FadeInOut>
                <FadeInOut
                    className="absolute"
                    show={showDone}
                >
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-(--fg-blue) text-(--fg-blue)">
                        <LucideCheck className="size-4" strokeWidth={3} />
                    </div>
                </FadeInOut>
                <div
                    className="flex flex-col gap-y-3 data-[fade-out=true]:opacity-40"
                    data-fade-out={isSavingTags}
                >
                    <div className="flex flex-col gap-y-3">
                        {groupA.map(name => (
                            <TagView
                                className="gap-2"
                                key={name}
                                name={name}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-[1fr_1fr] gap-x-3">
                        {groupB.map(name => (
                            <TagView
                                className="gap-2"
                                key={name}
                                name={name}
                            />
                        ))}
                    </div>
                </div>
            </SectionBody>
        </Section>
    )
}
