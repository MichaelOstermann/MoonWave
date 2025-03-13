import type { ReactNode } from 'react'
import { saveTags } from '@app/actions/tags/saveTags'
import { FadeInOut } from '@app/components/FadeInOut'
import { $hasEditedTags } from '@app/state/sidepanel/hasEditedTags'
import { $isSavingTags } from '@app/state/sidepanel/isSavingTags'
import { useSignal } from '@monstermann/signals'
import { LucideSave } from 'lucide-react'

export function SaveButton(): ReactNode {
    const isSavingTags = useSignal($isSavingTags)
    const hasChanges = useSignal($hasEditedTags)

    return (
        <FadeInOut
            show={hasChanges && !isSavingTags}
            onClick={function () {
                if (isSavingTags) return
                saveTags()
            }}
        >
            <button
                type="button"
                className="flex size-7 cursor-default items-center justify-center rounded-md bg-[--bg-blue] text-xs font-medium text-[--fg-blue]"
            >
                <LucideSave className="size-4" />
            </button>
        </FadeInOut>
    )
}
